import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="glow-orb purple"></div>
        <div className="glow-orb pink"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <div className="badge floating-element delay-1">✨ New Transitions Pack 2026</div>
          <h1 className="hero-title">
            Elevate Your Edits with <br/>
            <span className="text-gradient">Premium VFX</span> Bundles
          </h1>
          <p className="hero-subtitle">
            Instantly upgrade your videos with our high-end transition bundles, SFX packs, and 3D overlays. Built for Premiere Pro & After Effects.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Bundles</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
        
        <div className="hero-image-container floating-element delay-2">
          <img src="/vfx_hero_bundle.jpg" alt="VFX Asset Bundle 3D" className="hero-3d-image glass-panel" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
