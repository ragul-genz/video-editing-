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
          <div className="badge floating-element delay-1">✨ New Audio Templates 2026</div>
          <h1 className="hero-title">
            Elevate Your Sound with <br/>
            <span className="text-gradient">Premium Audio</span> Bundles
          </h1>
          <p className="hero-subtitle">
            Instantly upgrade your tracks with our high-end master templates, vocal chains, and synth presets. Built for FL Studio, Logic Pro, Ableton Live, Cubase & Studio One.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Bundles</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
        
        <div className="hero-image-container floating-element delay-2">
          <img src="/music_production_hero.jpg" alt="Music Production Setup" className="hero-3d-image glass-panel" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
