import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-background">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video-bg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-recording-studio-with-dj-equipment-4148-large.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="glow-orb blue"></div>
        <div className="glow-orb cyan"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <div className="badge floating-element delay-1">✨ New Audio Templates 2026</div>
          <h1 className="hero-title">
            Bring Your Story to Life with <br/>
            <span className="text-gradient">Professional Post-Production</span>
          </h1>
          <p className="hero-subtitle">
            Instantly upgrade your tracks with our high-end master templates, vocal chains, and synth presets. Built for FL Studio, Logic Pro, Ableton Live, Cubase & Studio One.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/bundles')}>Explore Bundles</button>
            <button className="btn-secondary" onClick={() => {
              navigate('/bundles');
              setTimeout(() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}>Watch Demo</button>
          </div>
          
          <div className="supported-daws floating-element delay-3" style={{ maxWidth: '800px', margin: '40px auto 0 auto', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontWeight: 'bold', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '15px' }}>SUPPORTED SOFTWARE & TOOLS:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Video Editing:</strong>
                <span style={{ color: 'var(--text-muted)' }}>Adobe Premiere Pro • DaVinci Resolve • Final Cut Pro • Avid Media Composer • Adobe After Effects</span>
              </div>
              <div>
                <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>DAWs:</strong>
                <span style={{ color: 'var(--text-muted)' }}>Pro Tools • FL Studio • Logic Pro • Cubase • Studio One • Ableton Live • Nuendo</span>
              </div>
              <div>
                <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>LUTs & Color:</strong>
                <span style={{ color: 'var(--text-muted)' }}>Cinematic LUTs • Custom LUTs • Rec.709 • Log-to-Rec.709 • Color Presets</span>
              </div>
              <div>
                <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Presets:</strong>
                <span style={{ color: 'var(--text-muted)' }}>Video Editing • Motion Graphics • Transition • Audio • Sound Design • Color Grading</span>
              </div>
            </div>
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
