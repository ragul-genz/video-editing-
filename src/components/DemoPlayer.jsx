import React, { useState, useEffect, useRef } from 'react';
import './DemoPlayer.css';

const DemoPlayer = ({ activeDemo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Auto-play audio when activeDemo changes
  useEffect(() => {
    if (activeDemo) {
      setIsPlaying(true);
      setProgress(0);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Simple mock audio url based on title (or just a generic one for demo)
      const audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

      if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log('Auto-play blocked by browser:', e));
      }
    }
  }, [activeDemo]);

  // Handle progress bar animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            return 0; // Reset
          }
          return prev + 1; // slower progress for demo
        });
      }, 50);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      if (progress >= 100) {
        setProgress(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
      if (audioRef.current) audioRef.current.play().catch(e => console.log(e));
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Ideally we'd clear activeDemo via a prop, but since we can't easily change App.jsx state from here without prop drilling, we'll just hide this component's DOM by forcing a local state if needed.
    // Actually we can just pause it, or add an onClose prop.
    if (onClose) onClose();
  };

  if (!activeDemo) return null;

  return (
    <div className="mini-player-container">
      <div className="mini-player glass-panel">
        <button className="mini-play-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <div className="mini-waveform">
          <div className="waveform-progress" style={{ width: `${progress}%` }}></div>
          <div className="waveform-bars">
            {/* Generate random heights for a static-looking waveform */}
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="mini-bar" 
                style={{ 
                  height: `${Math.random() * 80 + 20}%`,
                  opacity: i < (progress / 100) * 60 ? 1 : 0.4
                }}
              ></div>
            ))}
          </div>
        </div>
        
        
        <div className="mini-player-title">
          {activeDemo}
        </div>

        <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0 5px' }}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default DemoPlayer;
