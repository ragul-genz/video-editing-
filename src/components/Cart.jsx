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
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Cart items, 1: Razorpay Payment, 2: Success
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const { addOrder, currentUser, addToast, API_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (currentUser && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : '')
      }));
    }
  }, [currentUser]);

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
  const handleRazorpayPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

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
      // 1. Try to create server-side order
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
        description: `Order for ${cartItems.length} digital asset(s)`,
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
          setLoadingText("Verifying Payment & Unlocking Assets...");
          setIsLoading(true);

          const generatedOrderId = Date.now().toString().slice(-6);
          const paymentId = response.razorpay_payment_id;

          // Save each purchased asset with its download link
          const newOrder = {
            id: generatedOrderId,
            date: new Date().toISOString(),
            total: `₹${cartTotal.toFixed(2)}`,
            items: cartItems.map(item => ({
              id: item.id || '',
              title: item.title,
              price: item.price,
              driveLink: item.driveLink || ''
            })),
            status: 'Approved', // Auto-approved immediately upon payment!
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
              // Direct order creation
              await addOrder(newOrder);
            }
          } catch (err) {
            console.warn("Server verification warning, saving order directly:", err);
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
            setFormData({ name: '', phone: '' });
            onClose();
            navigate('/my-orders');
            addToast("Payment successful! Your purchased assets are ready for download.", "success");
          }, 2500);
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            addToast("Payment window closed.", "info");
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

        {/* --- STEP 0: Cart Items List (Professional UI) --- */}
        {checkoutStep === 0 && (
          <>
            <div className="cart-header">
              <div className="cart-header-title-wrap">
                <div className="cart-header-icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="cart-header-title">Your Cart</h3>
                  <span className="cart-header-badge">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <button className="close-cart-btn" onClick={resetCart} title="Close Cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                  <div className="empty-cart-icon-bubble">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <h4 style={{ margin: '12px 0 6px 0', fontSize: '1.1rem', color: '#fff' }}>Your cart is empty</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '240px' }}>
                    Explore our curated video editing packs and sound kits to upgrade your projects.
                  </p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '18px', padding: '10px 20px', fontSize: '0.85rem' }}
                    onClick={onClose}
                  >
                    Browse Assets
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={item.id || item._id || index} className="cart-item-card">
                    {/* Fixed Size Thumbnail */}
                    <div className="cart-item-thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="cart-item-img" />
                      ) : (
                        <div className="cart-item-placeholder">
                          {item.icon || (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Clean Item Content */}
                    <div className="cart-item-content">
                      <div className="cart-item-tag-row">
                        <span className="cart-item-tag">DIGITAL ASSET</span>
                        <span className="cart-item-license">• Lifetime Access</span>
                      </div>
                      <h4 className="cart-item-title" title={item.title}>{item.title}</h4>
                      <div className="cart-item-price-wrap">
                        <span className="cart-item-price">{item.price}</span>
                        <span className="cart-item-instant">Instant Download</span>
                      </div>
                    </div>

                    {/* Modern Trash Icon Button */}
                    <button
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id || item._id || item.title)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Breakdown */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-box">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span style={{ color: '#27c93f', fontWeight: '600' }}>Instant (Free)</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="btn-primary checkout-btn"
                  onClick={handleProceedToPayment}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Proceed to Checkout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <div className="cart-trust-badges">
                  <span>🔒 256-Bit SSL Checkout</span>
                  <span>•</span>
                  <span>⚡ Instant Google Drive Files</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- STEP 1: Razorpay Payment Gateway (Luxury Fintech UI) --- */}
        {checkoutStep === 1 && (
          <div className="checkout-payment" style={{ overflowY: 'auto' }}>
            <div className="cart-header">
              <div className="cart-header-title-wrap">
                <button className="back-step-btn" onClick={() => setCheckoutStep(0)} title="Back to Cart">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <div>
                  <h3 className="cart-header-title">Checkout</h3>
                  <span className="cart-header-badge">Step 2 of 2 • Secure Payment</span>
                </div>
              </div>

              <button className="close-cart-btn" onClick={resetCart} title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="checkout-body">
              {/* Luxury Order Summary Box with Item Previews */}
              <div className="checkout-summary-card">
                <div className="checkout-summary-header">
                  <div className="checkout-summary-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span>PURCHASING {cartItems.length} ASSET{cartItems.length > 1 ? 'S' : ''}</span>
                  </div>

                  <div className="checkout-account-chip" title={currentUser?.email}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{currentUser?.email}</span>
                  </div>
                </div>

                {/* Items Mini Preview */}
                <div className="checkout-items-preview">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="checkout-mini-item">
                      <div className="checkout-mini-thumb">
                        {item.image ? (
                          <img src={item.image} alt={item.title} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className="checkout-mini-info">
                        <span className="checkout-mini-name">{item.title}</span>
                        <span className="checkout-mini-desc">1x Digital License • GDrive</span>
                      </div>
                      <span className="checkout-mini-price">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-divider"></div>

                <div className="checkout-summary-footer">
                  <div>
                    <span className="checkout-total-subtitle">Total Amount</span>
                    <span className="checkout-free-delivery">⚡ Direct to Google Drive</span>
                  </div>
                  <div className="checkout-total-val">₹{cartTotal.toFixed(2)}</div>
                </div>
              </div>

              {/* Gateway Brand Showcase Card */}
              <div className="checkout-gateway-card">
                <div className="gateway-top-bar">
                  <div className="gateway-brand-badge">
                    <span className="gateway-pulse-dot"></span>
                    <span className="gateway-brand-name">Razorpay Verified</span>
                  </div>
                  <span className="instant-unlock-badge">⚡ Instant Unlock</span>
                </div>

                <h4 className="gateway-title">All Payment Methods Supported</h4>
                <p className="gateway-subtitle">
                  Pay with any Indian UPI app, Debit/Credit Card, or NetBanking. Once authorized, files unlock in your account.
                </p>

                <div className="gateway-methods-grid">
                  <div className="method-pill upi">
                    <span className="method-pill-icon">📱</span>
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                  </div>
                  <div className="method-pill card">
                    <span className="method-pill-icon">💳</span>
                    <span>Cards (Visa, RuPay, MC)</span>
                  </div>
                  <div className="method-pill netbanking">
                    <span className="method-pill-icon">🏦</span>
                    <span>Net Banking & Wallets</span>
                  </div>
                </div>
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handleRazorpayPayment} className="checkout-form">
                <div className="checkout-input-group">
                  <div className="checkout-label-row">
                    <label className="checkout-label">Full Name</label>
                    <span className="checkout-label-hint">For order invoice</span>
                  </div>
                  <div className="checkout-input-field-wrap">
                    <span className="checkout-input-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="checkout-input"
                    />
                  </div>
                </div>

                <div className="checkout-input-group">
                  <div className="checkout-label-row">
                    <label className="checkout-label">Phone Number</label>
                    <span className="checkout-label-hint">Optional for SMS receipt</span>
                  </div>
                  <div className="checkout-input-field-wrap">
                    <span className="checkout-input-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter a number"
                      className="checkout-input"
                    />
                  </div>
                </div>

                {/* High-End Payment Button */}
                <button
                  type="submit"
                  className="checkout-pay-btn"
                >
                  <div className="checkout-pay-btn-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <span className="checkout-pay-btn-text">Pay ₹{cartTotal.toFixed(2)} via Razorpay</span>
                  <svg className="checkout-pay-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              {/* Trust & Security Strip */}
              <div className="checkout-trust-strip">
                <div className="trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <span className="trust-dot">•</span>
                <div className="trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>Razorpay Verified</span>
                </div>
              </div>
            </div>
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
              Order Approved! Redirecting to your Orders & Downloads...
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

      </div>
    </>
  );
};

export default Cart;
