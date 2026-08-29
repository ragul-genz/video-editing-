import React from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';
import DemoPlayer from '../components/DemoPlayer';

const Home = ({ addToCart, onPreview, onProductClick, activeDemo }) => {
  return (
    <>
      <Hero />
      <Products addToCart={addToCart} onPreview={onPreview} onProductClick={onProductClick} />
      <DemoPlayer activeDemo={activeDemo} />
    </>
  );
};

export default Home;
