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
  
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, currentUser, setCurrentUser, addToast, API_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if(email === 'admin@ds3studio.in') {
        addToast('Please use Admin Login page.', 'error');
        return;
      }
      setIsAnimating(true);
      try {
        await loginUser(email, password);
        addToast('Logged in successfully!', 'success');
        navigate('/');
      } catch (err) {
        setIsAnimating(false);
        setError('Invalid email or password.');
      }
    } else {
      setIsLoading(true);
      try {
        // Basic registration logic hitting the real backend
        const res = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Registration failed. Email might exist.');
        const newUser = await res.json();
        setCurrentUser(newUser);
        addToast('Registered and logged in successfully!', 'success');
        navigate('/');
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
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
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid var(--glass-border)', 
                background: 'rgba(0,0,0,0.5)', 
                color: 'white',
                outline: 'none',
                paddingRight: '40px'
              }} 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
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
