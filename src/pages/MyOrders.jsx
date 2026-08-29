import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyOrders = () => {
  const { orders } = useContext(AppContext);

  return (
    <section style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <h1 className="section-title">My <span className="text-gradient">Orders</span></h1>
      
      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>You have no orders yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => (
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
                    background: order.status === 'Approved' ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 189, 46, 0.2)',
                    color: order.status === 'Approved' ? '#27c93f' : '#ffbd2e',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {order.status}
                  </div>
                  
                  {order.status === 'Approved' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your downloads are ready:</p>
                      {order.items.map((item, i) => (
                        <a key={i} href={item.driveLink || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                          Download {item.title}
                        </a>
                      ))}
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
    </section>
  );
};

export default MyOrders;
