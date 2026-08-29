import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AdminDashboard = () => {
  const { products, setProducts, siteSettings, setSiteSettings } = useContext(AppContext);
  const navigate = useNavigate();

  const [newLogoUrl, setNewLogoUrl] = useState(siteSettings.logoUrl);
  
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', icon: '🎹', color: '#007bff', features: '', driveLink: ''
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('ds3_admin_auth');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleUpdateLogo = (e) => {
    e.preventDefault();
    setSiteSettings({ ...siteSettings, logoUrl: newLogoUrl });
    alert("Logo updated successfully!");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price.includes('$') ? newProduct.price : `$${newProduct.price}`,
      icon: newProduct.icon,
      color: newProduct.color,
      features: newProduct.features.split(',').map(f => f.trim()),
      driveLink: newProduct.driveLink
    };
    
    setProducts([...products, productToAdd]);
    setNewProduct({ title: '', description: '', price: '', icon: '🎹', color: '#007bff', features: '', driveLink: '' });
    alert("Product added successfully!");
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('ds3_admin_auth');
    navigate('/');
  };

  return (
    <section style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Admin <span className="text-gradient">Dashboard</span></h1>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px' }}>Logout</button>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3>Site Logo Manager</h3>
        <form onSubmit={handleUpdateLogo} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
          <input 
            type="text" 
            value={newLogoUrl}
            onChange={(e) => setNewLogoUrl(e.target.value)}
            placeholder="Image URL (e.g., /ds3_logo.jpg or https://...)"
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Update Logo</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3>Add New Bundle (Google Drive Linked)</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <input type="text" placeholder="Product Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Price (e.g., $19.99)" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input type="text" placeholder="Icon Emoji (e.g., 🎹)" required value={newProduct.icon} onChange={e => setNewProduct({...newProduct, icon: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Brand Color Hex (e.g., #007bff)" required value={newProduct.color} onChange={e => setNewProduct({...newProduct, color: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Features (comma separated)" required value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input type="url" placeholder="Google Drive Link (https://drive.google.com/...)" required value={newProduct.driveLink} onChange={e => setNewProduct({...newProduct, driveLink: e.target.value})} style={{ ...inputStyle, gridColumn: 'span 2', borderColor: 'var(--primary)' }} />
          
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '15px' }}>Upload Bundle</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3>Manage Bundles</h3>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{p.icon} {p.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.price} | {p.driveLink}</p>
              </div>
              <button onClick={() => handleDeleteProduct(p.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem', color: '#ff0054', borderColor: '#ff0054' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
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
