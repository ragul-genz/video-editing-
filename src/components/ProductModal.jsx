import React, { useContext } from 'react';
import './ProductModal.css';
import DemoPlayer from './DemoPlayer';
import { AppContext } from '../context/AppContext';

const ProductModal = ({ product, isOpen, onClose, addToCart, onProductClick }) => {
  const { products, wishlist, addToWishlist, removeFromWishlist } = useContext(AppContext);
  
  if (!isOpen || !product) return null;

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`modal-content glass-panel ${isOpen ? 'open' : ''}`}>
        <button className="close-modal" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-body">
          <div className="modal-header-info">
            <div className="modal-icon" style={{ textShadow: `0 0 30px ${product.color}` }}>
              {product.image ? (
                <img src={product.image} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                product.icon
              )}
            </div>
            <div>
              <h2 className="modal-title">{product.title}</h2>
              <p className="modal-price">{product.price.replace('$', '₹')}</p>
            </div>
          </div>
          
          <p className="modal-desc">{product.description}</p>
          
          <div className="modal-features">
            <h3>What's Included:</h3>
            <ul>
              {product.features?.map((feature, i) => (
                <li key={i}>
                  <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {product.previewVideoUrl ? (
            <div className="modal-video-wrapper">
              <h3 style={{ marginBottom: '15px' }}>Video Preview</h3>
              {product.previewVideoUrl.includes('youtube.com') || product.previewVideoUrl.includes('youtu.be') || product.previewVideoUrl.includes('vimeo.com') ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', marginBottom: '20px' }}>
                  <iframe src={product.previewVideoUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }} allowFullScreen></iframe>
                </div>
              ) : (
                <video controls style={{ width: '100%', borderRadius: '10px', marginBottom: '20px', background: 'black' }} src={product.previewVideoUrl}></video>
              )}
            </div>
          ) : (
            <div className="modal-demo-wrapper">
              <h3>Interactive Audio Preview</h3>
              <DemoPlayer activeDemo={product.title} inModal={true} />
            </div>
          )}

          <div className="modal-actions">
            <button 
              className="btn-primary" 
              style={{ background: product.color, boxShadow: `0 0 20px ${product.color}80` }}
              onClick={() => {
                addToCart(product);
                onClose();
              }}
            >
              Add Bundle to Cart
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.8rem 2rem', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                const inWishlist = wishlist.find(w => w.id === product.id);
                inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
              }}
            >
              {wishlist.find(w => w.id === product.id) ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <h3 style={{ marginTop: '30px', marginBottom: '15px', fontSize: '1.1rem' }}>You might also like...</h3>
              <div className="related-grid">
                {relatedProducts.map(related => (
                  <div 
                    key={related.id} 
                    className="related-card glass-panel"
                    onClick={() => onProductClick && onProductClick(related)}
                  >
                    {related.image ? (
                      <img src={related.image} alt={related.title} />
                    ) : (
                      <div className="related-icon">{related.icon}</div>
                    )}
                    <div className="related-info">
                      <h4>{related.title}</h4>
                      <p>{related.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductModal;
