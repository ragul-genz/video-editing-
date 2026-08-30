import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TestimonialsPreview.css';

const previewReviews = [
  { id: 1, name: "Alex Mercer", role: "Music Producer", rating: 5, text: "The Logic Pro vocal chain is absolutely insane. Cut my mixing time in half and the vocals sit perfectly in the mix." },
  { id: 2, name: "Sarah J.", role: "Beatmaker", rating: 5, text: "FL Studio Master Template is a game changer. The routing is incredibly clean and intuitive." }
];

const TestimonialsPreview = () => {
  const navigate = useNavigate();
  
  return (
    <section className="testimonials-preview">
      <div className="section-header">
        <h2 className="section-title">Trusted by <span className="text-gradient">Producers</span></h2>
        <p className="section-subtitle">Don't just take our word for it.</p>
      </div>

      <div className="preview-grid">
        {previewReviews.map(review => (
          <div key={review.id} className="preview-card glass-panel">
            <div className="stars">
              {Array.from({ length: review.rating }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="review-text">"{review.text}"</p>
            <div className="review-author">
              <h4>{review.name}</h4>
              <span>{review.role}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-more-container">
        <button className="btn-secondary" onClick={() => navigate('/reviews')}>Read All Reviews</button>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
