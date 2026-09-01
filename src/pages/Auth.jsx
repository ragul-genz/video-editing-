import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loader from '../components/Loader';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { users, setUsers, currentUser, setCurrentUser, addToast } = useContext(AppContext);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if(email === 'admin@ds3studio.in') {
        addToast('Please use Admin Login page.', 'error');
        return;
      }
      setIsAnimating(true);
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          addToast('Logged in successfully!', 'success');
          navigate('/');
        } else {
          setIsAnimating(false);
          setError('Invalid email or password.');
        }
      }, 2000);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        if (users.find(u => u.email === email)) {
          setError('Email is already registered.');
          setIsLoading(false);
        } else {
          const newUser = { email, password };
          setUsers([...users, newUser]);
          setCurrentUser(newUser);
          navigate('/');
        }
      }, 1500);
    }
  };

  if (isLoading) {
    return <Loader fullScreen={true} text="Authenticating..." />;
  }

  return (
    <section style={{ padding: '100px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 className="section-title" style={{ marginBottom: '20px' }}>
          {isLogin ? 'Welcome ' : 'Create '} 
          <span className="text-gradient">{isLogin ? 'Back' : 'Account'}</span>
        </h1>
        
        {error && <div style={{ color: '#ff5f56', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)', 
              background: 'rgba(0,0,0,0.5)', 
              color: 'white',
              outline: 'none'
            }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)', 
              background: 'rgba(0,0,0,0.5)', 
              color: 'white',
              outline: 'none'
            }} 
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '10px' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </div>
      </div>

      {isAnimating && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--bg-dark)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h1 className="text-gradient" style={{ 
            fontSize: '3rem', 
            animation: 'slideUpFade 1s ease-out forwards',
            opacity: 0,
            transform: 'translateY(20px)'
          }}>
            Welcome Back!
          </h1>
          <div style={{
            marginTop: '20px',
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes slideUpFade {
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </section>
  );
};

export default Auth;
