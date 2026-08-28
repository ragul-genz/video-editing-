import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, cartTotal, clearCart }) => {
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = Cart, 1 = Success

  const handleCheckout = () => {
    setCheckoutStep(1);
    setTimeout(() => {
      clearCart();
      setCheckoutStep(0);
      onClose();
    }, 3000);
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-panel glass-panel ${isOpen ? 'open' : ''}`}>
        
        {checkoutStep === 0 ? (
          <>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-cart" onClick={onClose}>
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
              <button className="btn-primary checkout-btn" disabled={cartItems.length === 0} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="checkout-success">
            <div className="success-icon floating-element delay-1">✅</div>
            <h3>Purchase Successful!</h3>
            <p>Your bundles are ready for download.</p>
            <div className="download-loader">
              <div className="loader-bar"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
