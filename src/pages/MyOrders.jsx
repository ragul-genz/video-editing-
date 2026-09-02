import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';


const MyOrders = () => {
  const { orders, currentUser, addReview, addToast, reviews } = useContext(AppContext);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const userOrders = orders.filter(order => order.userEmail === currentUser?.email);

  const openReviewModal = (item) => {
    setSelectedProduct(item);
    setRating(5);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim().length < 5) {
      addToast("Please write a slightly longer review.", "error");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: currentUser?.email.split('@')[0] || "Verified Buyer",
      role: "Verified Buyer",
      rating,
      text: reviewText,
      productId: selectedProduct.id,
      userEmail: currentUser?.email
    };

    addReview(newReview);
    addToast("Thank you! Your review has been published.", "success");
    setReviewModalOpen(false);
  };

  return (
    <section style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <h1 className="section-title">My <span className="text-gradient">Account</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Welcome back, {currentUser?.email}</p>
      
      {userOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>You have no orders yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {userOrders.map((order, index) => (
            <div key={index} className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ marginBottom: '10px' }}>Order #{order.id}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Total: {order.total}</p>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Txn ID: {order.transactionId}</p>
                  <div style={{ marginTop: '15px' }}>
                    <strong>Items:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px', color: 'var(--primary)' }}>
                      {order.items.map((item, i) => <li key={i}>{item.title}</li>)}
                    </ul>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    background: ['Approved', 'Delivered'].includes(order.status) ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 189, 46, 0.2)',
                    color: ['Approved', 'Delivered'].includes(order.status) ? '#27c93f' : '#ffbd2e',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {order.status}
                  </div>
                  
                  {['Approved', 'Delivered'].includes(order.status) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your downloads are ready:</p>
                      
                      {order.deliveryLink && (
                        <div style={{ marginBottom: '10px' }}>
                          <a href={order.deliveryLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', padding: '10px 16px', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(45deg, #27c93f, #149c28)' }}>
                            Download Custom Files
                          </a>
                        </div>
                      )}
                      
                      {order.items.map((item, i) => {
                        const hasReviewed = reviews.some(r => r.productId === item.id && r.userEmail === currentUser?.email);
                        return (
                          <div key={i} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            {hasReviewed ? (
                              <a href={item.driveLink || 'https://drive.google.com'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', padding: '10px 16px', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>
                                Download {item.title}
                              </a>
                            ) : (
                              <button 
                                onClick={() => openReviewModal(item)}
                                style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' }}
                              >
                                ⭐ Write a Review to Unlock Download
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                      Waiting for Admin approval. We will verify your payment and update this status shortly.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewModalOpen && selectedProduct && (
        <>
          <div className="modal-overlay open" onClick={() => setReviewModalOpen(false)}></div>
          <div className="modal-content glass-panel open" style={{ maxWidth: '500px', padding: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Review: {selectedProduct.title}</h3>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '10px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star}
                      onClick={() => setRating(star)}
                      xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" 
                      fill={star <= rating ? "#ffc107" : "none"} 
                      stroke={star <= rating ? "#ffc107" : "var(--text-muted)"}
                      style={{ cursor: 'pointer' }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '10px' }}>Your Feedback</label>
                <textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the product? Did it help you?"
                  required
                  rows="4"
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
};

export default MyOrders;
