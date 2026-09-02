import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct, siteSettings, setSiteSettings, orders, updateOrder, reviews, deleteReview, users, addToast } = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [newLogoUrl, setNewLogoUrl] = useState(siteSettings.logoUrl);
  
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', image: '', color: '#007bff', features: '', driveLink: '', previewUrl: '', previewVideoUrl: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress as JPEG with 70% quality to save space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // If larger than 500kb, compress
        compressImage(file, (dataUrl) => setNewLogoUrl(dataUrl));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setNewLogoUrl(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // If larger than 500kb, compress
        compressImage(file, (dataUrl) => setNewProduct({ ...newProduct, image: dataUrl }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
        reader.readAsDataURL(file);
      }
    }
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        addToast("Audio file is too large! Please keep it under 2MB, or use an external URL.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, previewUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('ds3_admin_auth');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleUpdateLogo = (e) => {
    e.preventDefault();
    setSiteSettings({ ...siteSettings, logoUrl: newLogoUrl });
    addToast("Logo updated successfully!", "success");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productToAdd = {
      id: editingProductId ? editingProductId : Date.now(),
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price.includes('₹') ? newProduct.price : `₹${newProduct.price}`,
      image: newProduct.image,
      color: newProduct.color,
      features: typeof newProduct.features === 'string' ? newProduct.features.split(',').map(f => f.trim()) : newProduct.features,
      driveLink: newProduct.driveLink,
      previewUrl: newProduct.previewUrl,
      previewVideoUrl: newProduct.previewVideoUrl
    };
    
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productToAdd);
        addToast("Product updated successfully!", "success");
        setEditingProductId(null);
      } else {
        await addProduct(productToAdd);
        addToast("Product added successfully!", "success");
      }
      setNewProduct({ title: '', description: '', price: '', image: '', color: '#007bff', features: '', driveLink: '', previewUrl: '', previewVideoUrl: '' });
    } catch (error) {
      addToast("Failed to save product. Check required fields.", "error");
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      ...product,
      price: typeof product.price === 'string' ? product.price.replace('₹', '') : product.price,
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || '')
    });
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({ title: '', description: '', price: '', image: '', color: '#007bff', features: '', driveLink: '', previewUrl: '', previewVideoUrl: '' });
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('ds3_admin_auth');
    navigate('/');
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await updateOrder(orderId, { status: 'Approved' });
      addToast("Order approved successfully!", "success");
    } catch (err) {
      addToast("Failed to approve order.", "error");
    }
  };

  return (
    <section style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Admin <span className="text-gradient">Dashboard</span></h1>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', overflowX: 'auto' }}>
        {['overview', 'products', 'orders', 'customers', 'reviews', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'black' : 'white',
              border: '1px solid var(--primary)',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 'bold',
              transition: '0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
          <h3>Dashboard Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: '0 0 10px 0' }}>{orders.length}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Orders</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#27c93f', margin: '0 0 10px 0' }}>
                ₹{orders.reduce((acc, o) => acc + parseFloat(o.total.replace('₹', '') || 0), 0).toFixed(2)}
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Revenue</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#ffc107', margin: '0 0 10px 0' }}>{users.length}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Registered Customers</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#ff0054', margin: '0 0 10px 0' }}>{products.length}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active Bundles</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3>Site Logo Manager</h3>
        <form onSubmit={handleUpdateLogo} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {newLogoUrl && newLogoUrl.startsWith('data:image') ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                 <img src={newLogoUrl} alt="logo preview" style={{ height: '40px', objectFit: 'contain' }} />
                 <button type="button" onClick={() => setNewLogoUrl('')} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Clear</button>
              </div>
            ) : (
              <input 
                type="text" 
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="Image URL (e.g., /ds3_logo.jpg or https://...)"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Or upload from device:</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Update Logo</button>
        </form>
      </div>
      )}

      {activeTab === 'products' && (
      <>
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3>{editingProductId ? 'Edit Bundle' : 'Add New Bundle (Google Drive Linked)'}</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <input type="text" placeholder="Product Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Price (e.g., ₹19.99)" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <div style={{ ...inputStyle, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '-5px' }}>Thumbnail Image (URL or Upload)</label>
            {newProduct.image && newProduct.image.startsWith('data:image') ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
                 <img src={newProduct.image} alt="preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                 <button type="button" onClick={() => setNewProduct({...newProduct, image: ''})} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Remove Image</button>
               </div>
            ) : (
               <input type="text" placeholder="Thumbnail Image URL (e.g. /image.jpg)" value={newProduct.image || ''} onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', padding: '5px 0' }} />
            )}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload File:</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <input type="text" placeholder="Brand Color Hex (e.g., #007bff)" required value={newProduct.color} onChange={e => setNewProduct({...newProduct, color: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Features (comma separated)" required value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <div style={{ ...inputStyle, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '-5px' }}>Preview Audio (URL or Upload Music)</label>
            {newProduct.previewUrl && newProduct.previewUrl.startsWith('data:audio') ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
                 <audio controls src={newProduct.previewUrl} style={{ width: '100%', height: '30px' }} />
                 <button type="button" onClick={() => setNewProduct({...newProduct, previewUrl: ''})} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Remove</button>
               </div>
            ) : (
               <input type="text" placeholder="Preview URL (Manual Link or File URL)" value={newProduct.previewUrl || ''} onChange={e => setNewProduct({...newProduct, previewUrl: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', padding: '5px 0' }} />
            )}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload Music File:</span>
              <input type="file" accept="audio/*" onChange={handleMusicUpload} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} />
            </div>
          </div>
          
          <div style={{ ...inputStyle, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '-5px' }}>Preview Video (YouTube, Vimeo, or MP4 URL)</label>
            <input type="url" placeholder="Video Preview URL (e.g., https://youtube.com/embed/...)" value={newProduct.previewVideoUrl || ''} onChange={e => setNewProduct({...newProduct, previewVideoUrl: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', padding: '5px 0' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>* Direct upload not supported to save storage. Please paste a link.</span>
          </div>

          <input type="url" placeholder="Google Drive Link (https://drive.google.com/...)" required value={newProduct.driveLink} onChange={e => setNewProduct({...newProduct, driveLink: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2', borderColor: 'var(--primary)' }} />
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '15px' }}>{editingProductId ? 'Update Bundle' : 'Upload Bundle'}</button>
            {editingProductId && (
              <button type="button" onClick={handleCancelEdit} className="btn-secondary" style={{ padding: '15px' }}>Cancel</button>
            )}
          </div>
        </form>
      </div>
      
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3>Manage Bundles</h3>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  <div style={{ fontSize: '2rem' }}>{p.icon}</div>
                )}
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{p.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.price} | {p.driveLink}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditProduct(p)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem', color: '#00d2ff', borderColor: '#00d2ff' }}>Edit</button>
                <button onClick={() => handleDeleteProduct(p.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem', color: '#ff0054', borderColor: '#ff0054' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {activeTab === 'orders' && (
      <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
        <h3>Manage Customer Orders</h3>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {(!orders || orders.length === 0) ? (
            <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Order #{order.id} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>({new Date(order.date).toLocaleDateString()})</span></h4>
                  <p style={{ margin: '5px 0' }}><strong>Customer:</strong> {order.name}</p>
                  <p style={{ margin: '5px 0' }}><strong>Method:</strong> {order.paymentMethod}</p>
                  <p style={{ margin: '5px 0' }}><strong>Txn ID:</strong> {order.transactionId}</p>
                  <p style={{ margin: '5px 0' }}><strong>Total:</strong> {order.total}</p>
                  <div style={{ margin: '10px 0 0 0' }}>
                    <strong>Items:</strong>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
                      {order.items.map((item, i) => <li key={i}>{item.title}</li>)}
                    </ul>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    background: ['Approved', 'Delivered'].includes(order.status) ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 189, 46, 0.2)',
                    color: ['Approved', 'Delivered'].includes(order.status) ? '#27c93f' : '#ffbd2e',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {order.status}
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button onClick={() => handleApproveOrder(order.id)} className="btn-primary" style={{ display: 'block', padding: '8px 16px', fontSize: '0.9rem', width: '100%' }}>
                      Approve Payment
                    </button>
                  )}

                  {order.status === 'Approved' && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input 
                        type="url" 
                        placeholder="Google Drive Link for Custom Edit" 
                        id={`delivery-link-${order.id}`}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', width: '100%', fontSize: '0.85rem' }} 
                      />
                      <button 
                        onClick={async () => {
                          const link = document.getElementById(`delivery-link-${order.id}`).value;
                          if (link) {
                            try {
                              await updateOrder(order.id, { status: 'Delivered', deliveryLink: link });
                              addToast("Order marked as delivered with link!", "success");
                            } catch (err) {
                              addToast("Failed to update order", "error");
                            }
                          } else {
                            addToast("Please provide a delivery link", "error");
                          }
                        }}
                        className="btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%', background: 'linear-gradient(45deg, #27c93f, #149c28)' }}
                      >
                        Mark Delivered
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}

      {activeTab === 'reviews' && (
        <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
          <h3>Manage Customer Reviews</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {(!reviews || reviews.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{review.name} <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>({review.role})</span></h4>
                    <p style={{ margin: '0 0 10px 0', color: '#ffc107', fontSize: '1.2rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    <p style={{ margin: '0 0 5px 0', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{review.text}"</p>
                    {review.productName && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary)' }}>Purchased: {review.productName}</p>}
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => {
                      deleteReview(review.id);
                      addToast("Review deleted.", "success");
                    }} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#ff0054', borderColor: '#ff0054' }}>
                      Delete Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {activeTab === 'customers' && (
        <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
          <h3>Manage Customers</h3>
          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Total Orders</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const userOrders = orders.filter(o => o.userEmail === user.email);
                  const totalSpent = userOrders.reduce((acc, o) => acc + parseFloat(o.total.replace('₹', '') || 0), 0);
                  
                  return (
                    <tr key={user.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px 10px' }}>{user.email}</td>
                      <td style={{ padding: '15px 10px' }}>{userOrders.length}</td>
                      <td style={{ padding: '15px 10px' }}>₹{totalSpent.toFixed(2)}</td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No registered users.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(0,0,0,0.5)',
  color: 'white'
};

export default AdminDashboard;
