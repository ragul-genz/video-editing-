import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Products from '../components/Products';
import TestimonialsPreview from '../components/TestimonialsPreview';
import DemoPlayer from '../components/DemoPlayer';

const Home = ({ addToCart, onPreview, onProductClick, activeDemo, onCloseDemo }) => {
  return (
    <>
      <Hero />
      <Features />
      <Products addToCart={addToCart} onPreview={onPreview} onProductClick={onProductClick} />
      <TestimonialsPreview />
      <DemoPlayer activeDemo={activeDemo} onClose={onCloseDemo} />
    </>
  );
};

export default Home;
