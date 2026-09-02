import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, cartTotal, clearCart }) => {
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addOrder, currentUser, addToast } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    paymentMethod: 'UPI / GPay',
    transactionId: ''
  });

  const handleProceedToPayment = () => {
    setCheckoutStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      // Save order to context
      const newOrder = {
        id: Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        total: `₹${cartTotal.toFixed(2)}`,
        items: [...cartItems],
        status: 'Pending',
        name: formData.name,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        userEmail: currentUser?.email
      };
      
      try {
        await addOrder(newOrder);
      } catch (err) {
        addToast("Failed to save order to database. Please try again.", "error");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      setCheckoutStep(2);

      setTimeout(() => {
        // Generate WhatsApp message
        const itemsList = cartItems.map(i => i.title).join(", ");
        const message = `Hello! I just made a payment for an order on DS3 Studio.\n\n*Name:* ${formData.name}\n*Email:* ${currentUser?.email}\n*Payment Method:* ${formData.paymentMethod}\n*Transaction ID:* ${formData.transactionId}\n*Amount:* ₹${cartTotal.toFixed(2)}\n*Items:* ${itemsList}\n\nPlease approve my order so I can download the files!`;
        
        const whatsappUrl = `https://wa.me/919611015006?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        clearCart();
        setCheckoutStep(0);
        setFormData({ name: '', paymentMethod: 'UPI / GPay', transactionId: '' });
        onClose();
        navigate('/my-orders');
      }, 3000);
      
    }, 1500);
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
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,5,5,0.8)', zIndex: 10 }}>
            <Loader text="Processing Order..." />
          </div>
        )}

        {checkoutStep === 0 && (
          <>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-cart" onClick={resetCart}>
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
                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <p>{item.price}</p>
                    </div>
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

        {checkoutStep === 1 && (
          <div className="checkout-payment" style={{ overflowY: 'auto' }}>
            <div className="cart-header">
              <h3>Complete Payment</h3>
              <button className="close-cart" onClick={() => setCheckoutStep(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>
            
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Pay via UPI / QR</h4>
                <img src="/payment_qr.jpg" alt="Payment QR Code" style={{ width: '100%', maxWidth: '200px', borderRadius: '10px', marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>UPI ID: sujaynayar@oksbi</p>
              </div>
              
              <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Bank Transfer Details</h4>
                <p style={{ margin: '5px 0' }}><strong>Name:</strong> Sujay J</p>
                <p style={{ margin: '5px 0' }}><strong>Account No:</strong> 40264044813</p>
                <p style={{ margin: '5px 0' }}><strong>IFSC:</strong> SBIN0000876</p>
              </div>
            </div>

            <form className="payment-form" onSubmit={handlePaymentSubmit} style={{ paddingTop: 0 }}>
              <h4 style={{ marginBottom: '10px', color: 'white' }}>Submit Payment Proof</h4>
              
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  required 
                  value={formData.paymentMethod} 
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'inherit' }}
                >
                  <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Transaction ID / UTR No.</label>
                <input type="text" required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} placeholder="12-digit number" />
              </div>
              
              <button type="submit" className="btn-primary checkout-btn mt-4" style={{marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Submit & WhatsApp Owner
              </button>
            </form>
          </div>
        )}

        {checkoutStep === 2 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center'
          }}>
            <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h2 style={{ marginTop: '20px', color: 'var(--primary)', animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>Payment Successful!</h2>
            <p style={{ marginTop: '10px', color: 'var(--text-muted)', animation: 'fadeInUp 0.5s ease-out 0.2s forwards', opacity: 0 }}>
              Redirecting to WhatsApp and your Orders...
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
