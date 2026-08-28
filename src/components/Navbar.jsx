import React from 'react';
import './Navbar.css';

const Navbar = ({ cartCount = 0, onCartClick }) => {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <a href="#" className="logo">
          <span className="text-gradient">VFX</span>Vault
        </a>
        
        <ul className="nav-links">
          <li><a href="#products">Bundles</a></li>
          <li><a href="#demo">Preview</a></li>
          <li><a href="#features">Features</a></li>
        </ul>

        <div className="nav-actions">
          <button className="cart-btn" aria-label="Cart" onClick={onCartClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn-primary login-btn">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
