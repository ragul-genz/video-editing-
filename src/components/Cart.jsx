import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, cartTotal, clearCart }) => {
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = Cart, 1 = Payment, 2 = Success
  const [purchasedItems, setPurchasedItems] = useState([]);

  const handleProceedToPayment = () => {
    setCheckoutStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPurchasedItems([...cartItems]);
    setCheckoutStep(2);
    clearCart();
  };

  const resetCart = () => {
    setCheckoutStep(0);
    onClose();
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={resetCart}></div>
      <div className={`cart-panel glass-panel ${isOpen ? 'open' : ''}`}>
        
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
                    <div className="cart-item-icon">{item.icon}</div>
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
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary checkout-btn" disabled={cartItems.length === 0} onClick={handleProceedToPayment}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        {checkoutStep === 1 && (
          <div className="checkout-payment">
            <div className="cart-header">
              <h3>Payment Details</h3>
              <button className="close-cart" onClick={() => setCheckoutStep(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>
            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9101 1121" required pattern="\d{16}" title="16 digit card number" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="123" required />
                </div>
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <button type="submit" className="btn-primary checkout-btn mt-4" style={{marginTop: '20px'}}>
                Pay ${cartTotal.toFixed(2)}
              </button>
            </form>
          </div>
        )}

        {checkoutStep === 2 && (
          <div className="checkout-success">
            <div className="success-icon floating-element delay-1">✅</div>
            <h3>Payment Successful!</h3>
            <p>Your bundles are ready for download via Google Drive.</p>
            
            <div className="download-links">
              {purchasedItems.map((item, index) => (
                <a key={index} href={`https://drive.google.com/drive/folders/placeholder_${item.id}`} target="_blank" rel="noopener noreferrer" className="gdrive-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5M9.73 15L6.3 21h13.12l3.43-6M13.72 3.5h-6.6l6.56 11.5h6.58z"/>
                  </svg>
                  Download {item.title}
                </a>
              ))}
            </div>
            
            <button className="btn-secondary mt-4" style={{marginTop: '20px', width: '100%', padding: '10px', borderRadius: '30px', background: 'transparent', border: '1px solid var(--primary)', color: 'white'}} onClick={resetCart}>
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default Cart;
