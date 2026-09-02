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

import Wishlist from './pages/Wishlist';

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
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist addToCart={addToCart} onProductClick={openProductDetails} /></ProtectedRoute>} />
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
          <a 
            href="https://wa.me/919611015006?text=Hi%20DS3%20Studio!%20I%20have%20a%20question." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
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
