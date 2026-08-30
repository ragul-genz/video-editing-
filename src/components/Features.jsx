import React from 'react';
import './Features.css';

const featuresData = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    title: "Instant Download",
    description: "Get immediate access to all files right after checkout. No waiting."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
    title: "All DAWs Supported",
    description: "Templates crafted for FL Studio, Logic Pro, Ableton, and more."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    title: "100% Royalty Free",
    description: "Use all presets and templates in your commercial releases."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    title: "Time Saving",
    description: "Skip the tedious routing and mixing, jump straight into creating."
  }
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="section-title">Why Choose <span className="text-gradient">DS3 Studio</span></h2>
        <p className="section-subtitle">We build tools that let you focus on making music, not troubleshooting.</p>
      </div>
      
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div key={index} className="feature-card glass-panel floating-element" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
