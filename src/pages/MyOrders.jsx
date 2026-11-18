import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const getDriveDirectLink = (url) => {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download`;
  }
  return url;
};

const MyOrders = () => {
  const { orders, currentUser, addReview, addToast, reviews, products, fetchOrders, API_URL } = useContext(AppContext);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [recoveryPaymentId, setRecoveryPaymentId] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    if (fetchOrders) {
      fetchOrders();
    }
  }, [fetchOrders]);

  const handleRecoverOrder = async () => {
    const pid = (recoveryPaymentId || '').trim();
    if (!pid) {
      addToast('Please enter your Razorpay Payment ID (e.g. pay_...)', 'info');
      return;
    }
    setIsRecovering(true);
    try {
      const res = await axios.get(`${API_URL}/payment/sync-payment/${pid}`);
      if (res.data?.success && res.data?.order) {
        addToast('Order found & download unlocked!', 'success');
        setRecoveryPaymentId('');
        if (fetchOrders) await fetchOrders();
      } else {
        addToast(res.data?.error || 'Payment not found in Razorpay', 'error');
      }
    } catch (err) {
      console.error('Order recovery error:', err);
      addToast(err.response?.data?.error || 'Could not verify payment ID. Please check and try again.', 'error');
    } finally {
      setIsRecovering(false);
    }
  };

  const userOrders = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];
    const seen = new Set();
    return orders
      .filter(order => order.userEmail?.toLowerCase() === currentUser?.email?.toLowerCase())
      .filter(order => {
        const key = order.id || order.transactionId || order._id;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [orders, currentUser]);

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
      <h1 className="section-title">Purchase <span className="text-gradient">History</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Welcome back, {currentUser?.email}</p>
      
      {/* Self-Service Order Recovery (Instant UPI Fix) */}
      <div style={{ marginBottom: '30px', padding: '16px 20px', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#fff' }}>
          💡 <strong>Paid via UPI and don't see your download?</strong> Enter your Razorpay Payment ID from UPI SMS/App to instantly restore access:
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Payment ID (e.g. pay_U0pqJBMZaS5qJs)"
            value={recoveryPaymentId}
            onChange={(e) => setRecoveryPaymentId(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRecoverOrder(); }}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', flex: '1', minWidth: '220px', fontSize: '0.9rem' }}
          />
          <button
            onClick={handleRecoverOrder}
            disabled={isRecovering}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #00e5ff, #0088ff)', color: '#000', fontWeight: 'bold' }}
          >
            {isRecovering ? 'Restoring...' : 'Restore Download'}
          </button>
        </div>
      </div>

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
                      {(order.items || []).map((item, i) => <li key={i}>{item.title}</li>)}
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
                    {order.status === 'Delivered' ? 'Approved' : order.status}
                  </div>
                  
                  {['Approved', 'Delivered'].includes(order.status) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your downloads are ready:</p>
                      
                      {order.deliveryLink && (
                        <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <a href={getDriveDirectLink(order.deliveryLink)} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', padding: '10px 16px', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(45deg, #27c93f, #149c28)', color: '#fff', fontWeight: 'bold' }}>
                            📥 Direct Download
                          </a>
                          <a href={order.deliveryLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-block', padding: '10px 14px', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none' }}>
                            📂 Open Drive
                          </a>
                        </div>
                      )}
                      
                      {(order.items || []).map((item, i) => {
                        const hasReviewed = reviews.some(r => r.productId === item.id && r.userEmail === currentUser?.email);
                        const rawDrive = item.driveLink || products?.find(p => p.id === item.id || p.title === item.title)?.driveLink || 'https://drive.google.com';
                        const directUrl = getDriveDirectLink(rawDrive);

                        return (
                          <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              <a 
                                href={directUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-primary" 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '10px 18px', 
                                  fontSize: '0.9rem', 
                                  textAlign: 'center', 
                                  textDecoration: 'none',
                                  background: 'linear-gradient(135deg, #00e5ff, #0088ff)',
                                  color: '#000',
                                  fontWeight: '700',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)'
                                }}
                              >
                                <span>📥 Direct Download</span>
                              </a>
                              <a 
                                href={rawDrive} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-secondary" 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  padding: '10px 14px', 
                                  fontSize: '0.85rem', 
                                  textAlign: 'center', 
                                  textDecoration: 'none',
                                  borderRadius: '8px'
                                }}
                              >
                                <span>📂 Open Google Drive</span>
                              </a>
                            </div>
                            
                            {!hasReviewed ? (
                              <button 
                                onClick={() => openReviewModal(item)}
                                style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'var(--text-muted)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', transition: '0.2s' }}
                              >
                                ⭐ Leave a Review
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#27c93f' }}>✓ Reviewed</span>
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
