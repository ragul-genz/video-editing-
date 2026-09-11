import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import './SocialMedia.css';

const SocialMedia = () => {
  const socials = [
    {
      id: 1,
      name: 'DS3 Studio Instagram',
      description: 'Follow our official studio page for the latest updates, behind the scenes, and premium video editing content.',
      url: 'https://www.instagram.com/ds3__studio?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
      icon: <Instagram size={40} />,
      color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      shadow: 'rgba(220, 39, 67, 0.3)'
    },
    {
      id: 2,
      name: 'Personal Instagram',
      description: 'Connect with me personally and see my daily life and creative journey.',
      url: 'https://www.instagram.com/i_m__d_s_3?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
      icon: <Instagram size={40} />,
      color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      shadow: 'rgba(220, 39, 67, 0.3)'
    },
    {
      id: 3,
      name: 'Main YouTube Channel',
      description: 'Subscribe to our main channel for high-quality tutorials, free presets, and editing tips.',
      url: 'https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr',
      icon: <Youtube size={40} />,
      color: '#FF0000',
      shadow: 'rgba(255, 0, 0, 0.3)'
    },
    {
      id: 4,
      name: '2nd YouTube Channel',
      description: 'More content, casual videos, and extra tutorials on our secondary channel.',
      url: 'https://youtube.com/@ds3_--_official?si=93AFYkEc3JE1nVVx',
      icon: <Youtube size={40} />,
      color: '#FF0000',
      shadow: 'rgba(255, 0, 0, 0.3)'
    },
    {
      id: 5,
      name: 'Facebook Page',
      description: 'Join our Facebook community, stay updated with announcements, and interact with us.',
      url: 'https://www.facebook.com/share/1dX3XBPtTR/',
      icon: <Facebook size={40} />,
      color: '#1877F2',
      shadow: 'rgba(24, 119, 242, 0.3)'
    }
  ];

  return (
    <div className="social-media-page fade-in">
      <div className="social-header">
        <h1>Connect With <span className="highlight">Us</span></h1>
        <p>Follow our journey across platforms for the best content, tutorials, and behind-the-scenes.</p>
      </div>

      <div className="social-grid">
        {socials.map((social) => (
          <a 
            key={social.id} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-card glass-panel"
            style={{ '--hover-shadow': social.shadow }}
          >
            <div className="social-icon-wrapper" style={{ background: social.color }}>
              {social.icon}
            </div>
            <div className="social-content">
              <h2>{social.name}</h2>
              <p>{social.description}</p>
            </div>
            <div className="social-action">
              <span>Visit Page</span>
              <ExternalLink size={18} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
