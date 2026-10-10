import React, { useState } from 'react';

const Contact = () => {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2500);
  };

  return (
    <section className="contact-section floating-element delay-2" style={{ padding: '120px 20px 80px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)', padding: '5px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
          Direct Support
        </span>
        <h1 className="section-title" style={{ margin: '0 0 12px 0' }}>Get in <span className="text-gradient">Touch</span></h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Have questions about our templates, custom video edits, or order downloads? Reach out to us directly through phone, WhatsApp, or Gmail.
        </p>
      </div>

      {/* Luxury Contact Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', width: '100%', marginBottom: '40px' }}>
        
        {/* Card 1: Phone Support */}
        <div className="glass-panel" style={{ padding: '28px 24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', transition: 'transform 0.3s ease, border-color 0.3s ease' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.25)', color: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Direct Phone
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
            +91 9611015006
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            Available for direct calls & order support
          </p>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <a href="tel:9611015006" className="btn-primary" style={{ flex: 1, padding: '11px', fontSize: '0.9rem', borderRadius: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>Call Now</span>
            </a>
            <button 
              type="button" 
              onClick={() => handleCopy('9611015006', 'phone')}
              style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Copy Phone Number"
            >
              {copiedText === 'phone' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Card 2: Official WhatsApp */}
        <div className="glass-panel" style={{ padding: '28px 24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)', border: '1px solid rgba(37, 211, 102, 0.25)', position: 'relative', transition: 'transform 0.3s ease, border-color 0.3s ease' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.3)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#25D366', marginBottom: '6px' }}>
            Instant Chat
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
            WhatsApp Chat
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            Quick replies & direct customer messaging
          </p>
          <a 
            href="https://wa.me/919611015006?text=Hi%20DS3%20Studio!%20I%20have%20an%20inquiry%20about%20your%20products." 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ width: '100%', padding: '11px', fontSize: '0.9rem', borderRadius: '10px', textDecoration: 'none', background: '#25D366', color: '#000', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
          >
            <span>Message on WhatsApp</span>
          </a>
        </div>

        {/* Card 3: Official Gmail */}
        <div className="glass-panel" style={{ padding: '28px 24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)', border: '1px solid rgba(234, 67, 53, 0.25)', position: 'relative', transition: 'transform 0.3s ease, border-color 0.3s ease' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(234, 67, 53, 0.12)', border: '1px solid rgba(234, 67, 53, 0.3)', color: '#ea4335', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#ea4335', marginBottom: '6px' }}>
            Official Gmail
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: '0 0 6px 0', wordBreak: 'break-all' }}>
            ds3officialstudio@gmail.com
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            For business inquiries, collaborations & support
          </p>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <a href="mailto:ds3officialstudio@gmail.com" className="btn-primary" style={{ flex: 1, padding: '11px', fontSize: '0.9rem', borderRadius: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>Send Mail</span>
            </a>
            <button 
              type="button" 
              onClick={() => handleCopy('ds3officialstudio@gmail.com', 'email')}
              style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Copy Gmail Address"
            >
              {copiedText === 'email' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

      </div>

      {/* Studio Location Note */}
      <div className="glass-panel" style={{ width: '100%', padding: '20px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', background: 'rgba(255, 255, 255, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#fff' }}>DS3 Studio Creative HQ</strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Coorg (Kodagu), Karnataka, India</span>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Operating Hours: <span style={{ color: '#27c93f', fontWeight: '600' }}>Mon - Sat (10 AM - 8 PM IST)</span>
        </div>
      </div>

    </section>
  );
};

export default Contact;
