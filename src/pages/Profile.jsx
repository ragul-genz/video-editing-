import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const { currentUser, updateUserPassword, addToast } = useContext(AppContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast("Password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    updateUserPassword(currentUser.email, newPassword);
    addToast("Password updated successfully!", "success");
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <section style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <h1 className="section-title">My <span className="text-gradient">Profile</span></h1>
      
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '15px' }}>
        <h3 style={{ marginBottom: '20px' }}>Account Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Email Address</label>
            <input 
              type="email" 
              value={currentUser?.email || ''} 
              disabled 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }} 
            />
          </div>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Change Password</h3>
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', outline: 'none' }} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>Update Password</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
