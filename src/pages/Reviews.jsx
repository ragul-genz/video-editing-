import React from 'react';

const reviewsData = [
  { id: 1, name: "Alex Mercer", role: "Music Producer", rating: 5, text: "The Logic Pro vocal chain is absolutely insane. Cut my mixing time in half and the vocals sit perfectly in the mix." },
  { id: 2, name: "Sarah J.", role: "Beatmaker", rating: 5, text: "FL Studio Master Template is a game changer. The routing is incredibly clean and intuitive." },
  { id: 3, name: "DJ Kael", role: "Electronic Artist", rating: 5, text: "Those Ableton Live synth presets are huge. Immediate inspiration right out of the box." },
  { id: 4, name: "Michael R.", role: "Composer", rating: 5, text: "The Cubase orchestral template handles 100+ tracks flawlessly. Expression mapping is on point." },
];

const Reviews = () => {
  return (
    <section className="reviews-section floating-element" style={{ padding: '120px 20px', minHeight: '80vh' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="section-title">Producer <span className="text-gradient">Reviews</span></h2>
        <p className="section-subtitle">See what professionals are saying about DS3 Studio bundles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {reviewsData.map(review => (
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
              <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{review.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
