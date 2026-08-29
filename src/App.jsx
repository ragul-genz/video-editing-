import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Bundles from './pages/Bundles';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import MyOrders from './pages/MyOrders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import { AppContextProvider } from './context/AppContext';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState("FL Studio Master Template");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const previewProduct = (product) => {
    setActiveDemo(product.title);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + parseFloat(item.price.replace('$', ''));
  }, 0);

  return (
    <AppContextProvider>
      <Router>
        <div className="app">
          <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/bundles" element={<Bundles addToCart={addToCart} onPreview={previewProduct} onProductClick={openProductDetails} activeDemo={activeDemo} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
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
          />
        </div>
      </Router>
    </AppContextProvider>
  );
}

export default App;
