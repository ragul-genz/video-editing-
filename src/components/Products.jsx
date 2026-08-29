import React from 'react';
import './Products.css';

const products = [
  {
    id: 1,
    title: "FL Studio Master Template",
    description: "Industry-standard mixing & mastering template for FL Studio 21+.",
    price: "$29.99",
    icon: "🎹",
    color: "#ff7b00",
    features: ["Pre-routed Mixer Tracks", "Vocal Chain Presets", "Stock Plugins Only", "Bonus Sample Pack"]
  },
  {
    id: 2,
    title: "Logic Pro Vocal Chain",
    description: "Get pristine vocals instantly with our premium Logic Pro X channel strips.",
    price: "$34.99",
    icon: "🎙️",
    color: "#00a8ff",
    features: ["Pop & Rap Vocal Presets", "Zero Latency Recording", "Mastering Chain Included", "Easy to install"]
  },
  {
    id: 3,
    title: "Ableton Live Synth Presets",
    description: "100+ Serum & Vital presets tailored for Ableton Live 11+.",
    price: "$24.99",
    icon: "🎛️",
    color: "#00ff88",
    features: ["100+ Premium Presets", "Macros Pre-mapped", "Ableton Racks", "Future Bass & Trap"]
  },
  {
    id: 4,
    title: "Cubase Orchestral Template",
    description: "Massive orchestral routing template for Cubase Pro.",
    price: "$49.99",
    icon: "🎻",
    color: "#ff0054",
    features: ["Kontakt Routing", "Expression Maps", "Color Coded Tracks", "Stem Export Ready"]
  },
  {
    id: 5,
    title: "Studio One Mixing Preset",
    description: "Pro mixing console presets designed for Studio One 6.",
    price: "$29.99",
    icon: "🎚️",
    color: "#4facfe",
    features: ["Fat Drum Bus", "Silky Reverb Sends", "Analog Style Saturation", "Quick Mix Setup"]
  }
];

const Products = ({ addToCart, onPreview, onProductClick }) => {
  return (
    <section id="products" className="products-section">
      <div className="section-header">
        <h2 className="section-title">Featured <span className="text-gradient">Bundles</span></h2>
        <p className="section-subtitle">Premium assets to level up your editing game.</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card glass-panel floating-element delay-3 interactive-card"
            onClick={() => onProductClick(product)}
          >
            <div className="product-icon" style={{ textShadow: `0 0 20px ${product.color}` }}>
              {product.icon}
            </div>
            <h3 className="product-title">{product.title}</h3>
            <p className="product-desc">{product.description}</p>
            
            <div className="product-footer">
              <span className="product-price">{product.price}</span>
              <div className="product-actions">
                <button 
                  className="preview-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(product);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Preview
                </button>
                <button 
                  className="add-cart-btn" 
                  style={{ '--glow-color': product.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
