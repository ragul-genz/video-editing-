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
  
  const { users, setUsers, currentUser, setCurrentUser } = useContext(AppContext);
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
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          navigate('/');
        } else {
          setError('Invalid email or password.');
          setIsLoading(false);
        }
      } else {
        if (users.find(u => u.email === email)) {
          setError('Email is already registered.');
          setIsLoading(false);
        } else {
          const newUser = { email, password };
          setUsers([...users, newUser]);
          setCurrentUser(newUser);
          navigate('/');
        }
      }
    }, 1500); // Simulate a brief loading state
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
    </section>
  );
};

export default Auth;
