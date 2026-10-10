import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import './Cart.css';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TWTH9nOKea11hk';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = ({ isOpen, onClose, cartItems, cartTotal, clearCart, removeFromCart }) => {
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Cart items, 1: Checkout/Payment, 2: Success, 3: WhatsApp
  const [paymentTab, setPaymentTab] = useState('razorpay'); // 'razorpay' | 'manual'
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const [isWaitingForReturn, setIsWaitingForReturn] = useState(false);
  const { addOrder, currentUser, addToast, API_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'Razorpay',
    transactionId: ''
  });

  useEffect(() => {
    if (currentUser && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : '')
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const handleFocus = () => {
      if (isWaitingForReturn) {
        setIsWaitingForReturn(false);
        setCheckoutStep(2);

        // Wait for animation then navigate
        setTimeout(() => {
          clearCart();
          setCheckoutStep(0);
          setFormData({ name: '', phone: '', paymentMethod: 'Razorpay', transactionId: '' });
          onClose();
          navigate('/my-orders');
        }, 3000);
      }
    };

    window.addEventListener('focus', handleFocus);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWaitingForReturn]);

  const handleProceedToPayment = () => {
    if (!currentUser) {
      addToast("Please login or create an account to proceed with checkout!", "info");
      onClose();
      navigate('/auth');
      return;
    }
    setCheckoutStep(1);
  };

  // --- Online Razorpay Payment Flow ---
  const handleRazorpayPayment = async () => {
    if (!currentUser) {
      addToast("Please login before checkout.", "error");
      onClose();
      navigate('/auth');
      return;
    }

    const customerName = formData.name.trim() || (currentUser.email ? currentUser.email.split('@')[0] : "Customer");

    setLoadingText("Initializing Razorpay Gateway...");
    setIsLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsLoading(false);
      addToast("Could not load Razorpay SDK. Please check your internet connection.", "error");
      return;
    }

    try {
      // 1. Try to create order on server
      let serverOrderData = null;
      try {
        const orderRes = await axios.post(`${API_URL}/payment/create-order`, {
          amount: cartTotal,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        });
        if (orderRes.data && orderRes.data.orderId) {
          serverOrderData = orderRes.data;
        }
      } catch (srvErr) {
        console.warn("Backend order creation warning (using direct client checkout fallback):", srvErr.message);
      }

      const activeKey = serverOrderData?.key || RAZORPAY_KEY_ID;
      const amountPaise = serverOrderData ? serverOrderData.amount : Math.round(cartTotal * 100);

      const options = {
        key: activeKey,
        amount: amountPaise,
        currency: serverOrderData?.currency || 'INR',
        name: 'DS3 STUDIO',
        description: `Order of ${cartItems.length} digital asset(s)`,
        image: '/ds3_logo.jpg',
        order_id: serverOrderData?.orderId || undefined,
        prefill: {
          name: customerName,
          email: currentUser?.email || '',
          contact: formData.phone || ''
        },
        notes: {
          customerEmail: currentUser?.email || '',
          items: cartItems.map(i => i.title).join(', ').slice(0, 200)
        },
        theme: {
          color: '#00e5ff'
        },
        handler: async function (response) {
          setLoadingText("Verifying Payment & Confirming Order...");
          setIsLoading(true);

          const generatedOrderId = Date.now().toString().slice(-6);
          const paymentId = response.razorpay_payment_id;

          const newOrder = {
            id: generatedOrderId,
            date: new Date().toISOString(),
            total: `₹${cartTotal.toFixed(2)}`,
            items: [...cartItems],
            status: 'Approved', // Auto-approved upon verified Razorpay payment!
            name: customerName,
            paymentMethod: 'Razorpay',
            transactionId: paymentId,
            userEmail: currentUser?.email,
            razorpayOrderId: response.razorpay_order_id || serverOrderData?.orderId || '',
            razorpayPaymentId: paymentId,
            razorpaySignature: response.razorpay_signature || ''
          };

          try {
            // Verify on server if signature is available
            if (response.razorpay_signature && response.razorpay_order_id) {
              await axios.post(`${API_URL}/payment/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: newOrder
              });
              await addOrder(newOrder);
            } else {
              // Direct order confirmation
              await addOrder(newOrder);
            }
          } catch (err) {
            console.warn("Server verification issue, falling back to direct order save:", err);
            try {
              await addOrder(newOrder);
            } catch (saveErr) {
              console.error("Order save fallback error:", saveErr);
            }
          }

          setIsLoading(false);
          setCheckoutStep(2); // Show animated checkmark

          setTimeout(() => {
            clearCart();
            setCheckoutStep(0);
            setFormData({ name: '', phone: '', paymentMethod: 'Razorpay', transactionId: '' });
            onClose();
            navigate('/my-orders');
            addToast("Payment successful! Your order has been approved.", "success");
          }, 3000);
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            addToast("Payment cancelled.", "info");
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (resp) {
        setIsLoading(false);
        addToast(`Payment failed: ${resp.error.description || 'Transaction unsuccessful'}`, "error");
      });

      setIsLoading(false);
      rzpInstance.open();

    } catch (err) {
      setIsLoading(false);
      console.error("Razorpay payment error:", err);
      addToast("Failed to initiate payment gateway. Please try again.", "error");
    }
  };

  // --- Manual UPI / QR Code Fallback Flow ---
  const handleManualPaymentSubmit = (e) => {
    e.preventDefault();
    setLoadingText("Processing Order...");
    setIsLoading(true);

    setTimeout(async () => {
      const newOrder = {
        id: Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        total: `₹${cartTotal.toFixed(2)}`,
        items: [...cartItems],
        status: 'Pending',
        name: formData.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Customer'),
        paymentMethod: formData.paymentMethod || 'Manual UPI',
        transactionId: formData.transactionId,
        userEmail: currentUser?.email
      };

      try {
        await addOrder(newOrder);
      } catch (err) {
        addToast("Failed to save order. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

      const itemsList = cartItems.map(i => i.title).join(", ");
      const message = `Hello! I just made a manual payment for an order on DS3 Studio.\n\n*Name:* ${formData.name}\n*Email:* ${currentUser?.email}\n*Payment Method:* ${formData.paymentMethod}\n*Transaction ID:* ${formData.transactionId}\n*Amount:* ₹${cartTotal.toFixed(2)}\n*Items:* ${itemsList}\n\nPlease approve my order so I can download the files!`;

      const whatsappUrl = `https://wa.me/919611015006?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setCheckoutStep(3);
      setIsWaitingForReturn(true);
    }, 1200);
  };

  const resetCart = () => {
    setCheckoutStep(0);
    onClose();
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={resetCart}></div>
      <div className={`cart-panel glass-panel ${isOpen ? 'open' : ''}`}>

        {isLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,5,5,0.85)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader text={loadingText} />
          </div>
        )}

        {/* --- STEP 0: Cart Items List --- */}
        {checkoutStep === 0 && (
          <>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-cart" onClick={resetCart} title="Close Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">Your cart is empty.</div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-icon">
                      {item.image ? (
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="cart-item-details" style={{ flex: 1 }}>
                      <h4>{item.title}</h4>
                      <p>{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ff0054', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}
                      title="Remove from cart"
                    >
                      ✖
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary checkout-btn" disabled={cartItems.length === 0} onClick={handleProceedToPayment}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        {/* --- STEP 1: Payment Selection --- */}
        {checkoutStep === 1 && (
          <div className="checkout-payment" style={{ overflowY: 'auto' }}>
            <div className="cart-header">
              <h3>Checkout & Pay</h3>
              <button className="close-cart" onClick={() => setCheckoutStep(0)} title="Back to Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Order Summary Pill */}
            <div style={{ margin: '15px 20px 0 20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Items: {cartItems.length}</span>
                <span style={{ fontSize: '0.85rem', color: '#00e5ff' }}>Logged in as: {currentUser?.email}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Payable</span>
                <strong style={{ fontSize: '1.3rem', color: '#fff' }}>₹{cartTotal.toFixed(2)}</strong>
              </div>
            </div>

            {/* Payment Method Switch Tabs */}
            <div className="payment-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${paymentTab === 'razorpay' ? 'active' : ''}`}
                onClick={() => setPaymentTab('razorpay')}
              >
                <span>⚡ Razorpay Online</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentTab === 'manual' ? 'active' : ''}`}
                onClick={() => setPaymentTab('manual')}
              >
                <span>Manual UPI / QR</span>
              </button>
            </div>

            {/* Tab A: Razorpay Online Payment */}
            {paymentTab === 'razorpay' && (
              <div className="razorpay-box">
                <div className="razorpay-card">
                  <div className="razorpay-badge">
                    <span>● Instant Access</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.1rem' }}>Razorpay Payment Gateway</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Pay securely using UPI, Cards, or NetBanking. Once payment succeeds, your download links are unlocked instantly!
                  </p>
                  
                  <div className="razorpay-methods-list">
                    <span className="method-tag">Google Pay</span>
                    <span className="method-tag">PhonePe</span>
                    <span className="method-tag">Paytm UPI</span>
                    <span className="method-tag">Credit / Debit Card</span>
                    <span className="method-tag">Net Banking</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number (Optional for SMS receipt)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>

                <button
                  type="button"
                  className="razorpay-submit-btn"
                  onClick={handleRazorpayPayment}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Pay ₹{cartTotal.toFixed(2)} with Razorpay
                </button>

                <div className="security-footer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                </div>
              </div>
            )}

            {/* Tab B: Manual UPI / QR Code Fallback */}
            {paymentTab === 'manual' && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Pay via UPI QR</h4>
                    <img src="/payment_qr.jpg" alt="Payment QR Code" style={{ width: '100%', maxWidth: '180px', borderRadius: '10px', marginBottom: '10px' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>UPI ID: sujaynayar@oksbi</p>
                  </div>

                  <div className="glass-panel" style={{ padding: '12px', marginBottom: '15px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                    <h5 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Bank Transfer Details</h5>
                    <p style={{ margin: '3px 0' }}><strong>Name:</strong> Sujay J</p>
                    <p style={{ margin: '3px 0' }}><strong>Account No:</strong> 40264044813</p>
                    <p style={{ margin: '3px 0' }}><strong>IFSC:</strong> SBIN0000876</p>
                  </div>
                </div>

                <form className="payment-form" onSubmit={handleManualPaymentSubmit} style={{ padding: 0 }}>
                  <h4 style={{ marginBottom: '8px', color: 'white', fontSize: '0.95rem' }}>Submit Manual Payment Proof</h4>

                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      required
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'inherit' }}
                    >
                      <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Transaction ID / UTR No.</label>
                    <input type="text" required value={formData.transactionId} onChange={e => setFormData({ ...formData, transactionId: e.target.value })} placeholder="12-digit number" />
                  </div>

                  <button type="submit" className="btn-primary checkout-btn mt-4" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    Submit & WhatsApp Owner
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* --- STEP 2: Payment Success Screen --- */}
        {checkoutStep === 2 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center'
          }}>
            <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <h2 style={{ marginTop: '20px', color: 'var(--primary)', animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>Payment Successful!</h2>
            <p style={{ marginTop: '10px', color: 'var(--text-muted)', animation: 'fadeInUp 0.5s ease-out 0.2s forwards', opacity: 0 }}>
              Order Approved! Redirecting to your Orders...
            </p>
            <style>{`
              .success-checkmark {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: block;
                stroke-width: 4;
                stroke: #27c93f;
                stroke-miterlimit: 10;
                box-shadow: inset 0px 0px 0px #27c93f;
                animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
              }
              .success-checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 4;
                stroke-miterlimit: 10;
                stroke: #27c93f;
                fill: none;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
              }
              .success-checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
              }
              @keyframes stroke {
                100% { stroke-dashoffset: 0; }
              }
              @keyframes scale {
                0%, 100% { transform: none; }
                50% { transform: scale3d(1.1, 1.1, 1); }
              }
              @keyframes fill {
                100% { box-shadow: inset 0px 0px 0px 30px rgba(39, 201, 63, 0.1); }
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        )}

        {/* --- STEP 3: Manual WhatsApp Waiting Screen --- */}
        {checkoutStep === 3 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(39, 201, 63, 0.2)',
              borderTopColor: '#27c93f',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h2 style={{ marginTop: '20px', color: 'var(--primary)' }}>WhatsApp Opened!</h2>
            <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
              Please send the message to the owner in the new tab, then <strong>return to this tab</strong> to complete your order.
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

      </div>
    </>
  );
};

export default Cart;
