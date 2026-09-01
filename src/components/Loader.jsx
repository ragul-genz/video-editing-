import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-spinner"></div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;
