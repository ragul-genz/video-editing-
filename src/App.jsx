import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Bundles from './pages/Bundles';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import { ToastContainer } from './components/Toast';
import { AppContextProvider, AppContext } from './context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ToastWrapper = () => {
  const { toasts, removeToast } = useContext(AppContext);
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};

const AppContent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const previewProduct = (product) => {
    setActiveDemo(product);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + parseFloat(item.price.replace('₹', '').replace('$', ''));
  }, 0);

  return (
    <div className="app">
      {!isAdminRoute && <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />}
      <main>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Home addToCart={addToCart} onPreview={previewProduct} onProductClick={openProductDetails} activeDemo={activeDemo} onCloseDemo={() => setActiveDemo(null)} /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/bundles" element={<ProtectedRoute><Bundles addToCart={addToCart} onPreview={previewProduct} onProductClick={openProductDetails} activeDemo={activeDemo} onCloseDemo={() => setActiveDemo(null)} /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && (
        <>
          <Cart 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cartItems={cartItems}
            cartTotal={cartTotal}
            clearCart={() => setCartItems([])}
          />
          <ProductModal 
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            addToCart={addToCart}
            onProductClick={openProductDetails}
          />
          <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', marginTop: '40px' }}>
            Developed by : GenZ Neural X & Win Tech
          </footer>
        </>
      )}
      <ToastWrapper />
    </div>
  );
};

function App() {
  return (
    <AppContextProvider>
      <Router>
        <AppContent />
      </Router>
    </AppContextProvider>
  );
}

export default App;
