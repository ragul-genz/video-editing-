import React from 'react';

export const Instagram = ({ size = 24, className = '', style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const Facebook = ({ size = 24, className = '', style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const Youtube = ({ size = 24, className = '', style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M2.5 7.1C2.5 7.1 2 8.6 2 12s.5 4.9.5 4.9A2.4 2.4 0 0 0 4.9 19.3c2.3.2 7.1.2 7.1.2s4.8 0 7.1-.2a2.4 2.4 0 0 0 2.4-2.4c0 0 .5-1.5.5-4.9s-.5-4.9-.5-4.9A2.4 2.4 0 0 0 19.1 4.7C16.8 4.5 12 4.5 12 4.5s-4.8 0-7.1.2A2.4 2.4 0 0 0 2.5 7.1z"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);
