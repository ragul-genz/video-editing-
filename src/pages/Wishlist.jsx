import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Wishlist = ({ onProductClick, addToCart }) => {
  const { wishlist, removeFromWishlist } = useContext(AppContext);

  if (wishlist.length === 0) {
    return (
      <section style={{ padding: '100px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="section-title">Your <span className="text-gradient">Wishlist</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>Your wishlist is currently empty.</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '100px 20px', minHeight: '80vh' }}>
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Your <span className="text-gradient">Wishlist</span>
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {wishlist.map(product => (
            <div key={product.id} className="glass-panel interactive-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div 
                style={{ 
                  height: '200px', 
                  background: `url(${product.image}) center/cover`, 
                  borderRadius: '12px',
                  marginBottom: '20px',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '20px', color: product.color, fontWeight: 'bold' }}>
                  {product.price}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                  style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4757', fontSize: '1.2rem' }}
                  title="Remove from Wishlist"
                >
                  ✖
                </button>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{product.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', flex: 1 }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => onProductClick(product)}>
                  Details
                </button>
                <button className="btn-secondary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '30px', cursor: 'pointer' }} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
