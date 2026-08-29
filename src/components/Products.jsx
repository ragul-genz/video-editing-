import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Products.css';

const Products = ({ addToCart, onPreview, onProductClick }) => {
  const { products } = useContext(AppContext);

  return (
    <section id="products" className="products-section">
      <div className="section-header">
        <h2 className="section-title">Featured <span className="text-gradient">Bundles</span></h2>
        <p className="section-subtitle">Premium assets to level up your editing game.</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card glass-panel floating-element delay-3 interactive-card"
            onClick={() => onProductClick(product)}
          >
            <div className="product-icon" style={{ textShadow: `0 0 20px ${product.color}` }}>
              {product.icon}
            </div>
            <h3 className="product-title">{product.title}</h3>
            <p className="product-desc">{product.description}</p>
            
            <div className="product-footer">
              <span className="product-price">{product.price}</span>
              <div className="product-actions">
                <button 
                  className="preview-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(product);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Preview
                </button>
                <button 
                  className="add-cart-btn" 
                  style={{ '--glow-color': product.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
