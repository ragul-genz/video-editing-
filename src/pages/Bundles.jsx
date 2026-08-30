import React from 'react';
import Products from '../components/Products';
import DemoPlayer from '../components/DemoPlayer';

const Bundles = ({ addToCart, onPreview, onProductClick, activeDemo, onCloseDemo }) => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <Products addToCart={addToCart} onPreview={onPreview} onProductClick={onProductClick} />
      <DemoPlayer activeDemo={activeDemo} onClose={onCloseDemo} />
    </div>
  );
};

export default Bundles;
