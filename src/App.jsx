import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';

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
    <Router>
      <div className="app">
        <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} onPreview={previewProduct} onProductClick={openProductDetails} activeDemo={activeDemo} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
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
  );
}

export default App;
