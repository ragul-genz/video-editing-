import React from 'react';

const About = () => {
  return (
    <section className="about-section floating-element delay-1" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="section-title">About <span className="text-gradient">DS3 Studio</span></h1>
      <p className="section-subtitle" style={{ maxWidth: '800px', margin: '20px auto', fontSize: '1.2rem', lineHeight: '1.8' }}>
        At DS3 Studio, our mission is to empower music producers and audio engineers of all skill levels. 
        We provide industry-standard DAW templates, vocal chains, and synth presets crafted by professionals. 
        Whether you use FL Studio, Logic Pro, Ableton Live, or Studio One, our premium audio bundles are designed to instantly elevate your sound to the next level.
      </p>
    </section>
  );
};

export default About;
