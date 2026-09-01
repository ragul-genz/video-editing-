import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Reviews = () => {
  const { reviews } = useContext(AppContext);

  return (
    <section className="reviews-section floating-element" style={{ padding: '120px 20px', minHeight: '80vh' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="section-title">Producer <span className="text-gradient">Reviews</span></h2>
        <p className="section-subtitle">See what professionals are saying about DS3 Studio bundles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No reviews yet. Check back soon!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="glass-panel" style={{ padding: '30px', borderRadius: '15px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '5px', color: '#ffc107', marginBottom: '15px' }}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>"{review.text}"</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{review.name}</h4>
              <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{review.role || "Verified Buyer"}</span>
              {review.productName && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Purchased: {review.productName}</div>}
            </div>
          </div>
        )))}
      </div>
    </section>
  );
};

export default Reviews;
