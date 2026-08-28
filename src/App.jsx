import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import DemoPlayer from './components/DemoPlayer';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState("Cinematic Transitions Pro");
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
    <div className="app">
      <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <Products addToCart={addToCart} onPreview={previewProduct} onProductClick={openProductDetails} />
        <DemoPlayer activeDemo={activeDemo} />
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
  );
}

export default App;
