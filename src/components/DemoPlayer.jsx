import React, { useState, useEffect, useRef } from 'react';
import './DemoPlayer.css';

const getDriveStreamUrl = (url) => {
  if (!url) return '';
  // Google Drive (May be blocked by Google CORS policies)
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`;
  }

  // Dropbox support
  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'raw=1').replace('?dl=0', '?raw=1');
  }

  return url; // fallback to original
};

const DemoPlayer = ({ activeDemo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  // Auto-play audio when activeDemo changes
  useEffect(() => {
    if (activeDemo) {
      setIsPlaying(false);
      setProgress(0);
      setError(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }

      // Try previewUrl first, fallback to driveLink, then fallback to mock audio if both are missing
      let rawUrl = activeDemo.previewUrl || activeDemo.driveLink;
      let audioUrl = getDriveStreamUrl(rawUrl);
      
      // If still no url (e.g. they left both blank on default products), use the mock one
      if (!audioUrl) {
        audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
      }

      if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.volume = volume;
        
        // Listeners for progress and end
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current.duration) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        });
        
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(0);
        });

        audioRef.current.addEventListener('error', () => {
          console.error("Failed to load audio");
          setError(true);
          setIsPlaying(false);
        });

        // Try to play
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log('Auto-play blocked or failed:', e);
          setIsPlaying(false);
        });
      }
    }
  }, [activeDemo]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (error) return; // Don't try playing if there's an error
    
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      if (progress >= 100) {
        setProgress(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
          console.log(e);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (onClose) onClose();
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  if (!activeDemo) return null;

  return (
    <div className="mini-player-container">
      <div className="mini-player glass-panel">
        <button className="mini-play-btn" onClick={togglePlay} disabled={error}>
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
          <div className="waveform-progress" style={{ width: `${progress}%`, position: 'absolute', height: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
          <div className="waveform-bars">
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
        
        <div className="mini-player-title" style={{ color: error ? '#ff5f56' : 'var(--text-muted)' }}>
          {error ? 'Failed to load Audio' : activeDemo.title}
        </div>

        <div className="volume-control" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0 5px' }}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default DemoPlayer;
