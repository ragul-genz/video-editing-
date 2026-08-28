import React, { useState, useEffect } from 'react';
import './DemoPlayer.css';

const DemoPlayer = ({ activeDemo, inModal = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play when activeDemo changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [activeDemo]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 2; // 50 steps = 2.5 seconds approx if 50ms interval
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(true);
  };

  const isSFX = activeDemo?.includes('SFX');
  const isLUTs = activeDemo?.includes('LUTs');

  return (
    <section id="demo" className="demo-section">
      {!inModal && (
        <div className="section-header">
          <h2 className="section-title">Experience the <span className="text-gradient">Magic</span></h2>
          <p className="section-subtitle">
            {activeDemo ? `Previewing: ${activeDemo}` : 'Select a bundle above to preview.'}
          </p>
        </div>
      )}

      <div className="demo-container floating-element">
        <div className="editor-mockup glass-panel">
          {/* Editor Header */}
          <div className="editor-header">
            <div className="window-controls">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="editor-title">{isSFX ? 'Audio_Mix_Session.sesx' : (isLUTs ? 'Lumetri_Color_Grade.prproj' : 'VFX_Master_Project.prproj')}</div>
          </div>

          {/* Video / Audio Player Area */}
          <div className="video-player">
            <div className={`video-screen ${isPlaying ? 'playing' : ''}`}>
              {!isPlaying && progress === 0 ? (
                <div className="play-overlay" onClick={handlePlay}>
                  <button className="play-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <span>{isSFX ? 'Click to Listen to SFX' : (isLUTs ? 'Click to Preview Color Grade' : 'Click to Preview Transition')}</span>
                </div>
              ) : (
                <div className="video-content" onClick={() => setIsPlaying(false)}>
                  {isSFX ? (
                    <div className="audio-visualizer">
                      <div className="waveform-container">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="bar" 
                            style={{ 
                              height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
                              animationDelay: `${i * 0.05}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="sfx-title">Sci-Fi Impact_01.wav</div>
                    </div>
                  ) : isLUTs ? (
                    <div className="luts-visualizer">
                       <div className="luts-original">RAW LOG footage</div>
                       <div className="luts-graded" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
                         LUT Grade applied
                       </div>
                       <div className="luts-slider" style={{ left: `${progress}%` }}></div>
                    </div>
                  ) : (
                    <>
                      <div className="scene scene-1" style={{ opacity: progress > 50 ? 0 : 1 }}></div>
                      {progress > 40 && progress < 60 && <div className="glitch-transition"></div>}
                      <div className="scene scene-2" style={{ opacity: progress > 50 ? 1 : 0 }}></div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Mockup */}
          <div className="timeline-mockup">
            <div className="timeline-tracks">
              {!isSFX && !isLUTs && (
                <>
                  <div className="track v-track">
                    <span className="track-label">V2</span>
                    <div className="clip fx-clip" style={{ left: '40%', width: '20%' }}>VFX Transition</div>
                  </div>
                  <div className="track v-track">
                    <span className="track-label">V1</span>
                    <div className="clip video-clip" style={{ left: '5%', width: '45%' }}>Shot_01.mp4</div>
                    <div className="clip video-clip" style={{ left: '50%', width: '45%' }}>Shot_02.mp4</div>
                  </div>
                </>
              )}
              {isSFX && (
                <>
                  <div className="track a-track">
                    <span className="track-label">A1</span>
                    <div className="clip fx-clip" style={{ left: '30%', width: '40%', background: '#ff0054' }}>Sci-Fi_Impact.wav</div>
                  </div>
                  <div className="track a-track">
                    <span className="track-label">A2</span>
                    <div className="clip audio-clip" style={{ left: '5%', width: '90%' }}>Ambient_Drone.wav</div>
                  </div>
                </>
              )}
              {isLUTs && (
                <>
                  <div className="track v-track">
                    <span className="track-label">V2</span>
                    <div className="clip fx-clip" style={{ left: '0%', width: '100%', background: '#ffbe0b', color: '#000' }}>Lumetri Color FX</div>
                  </div>
                  <div className="track v-track">
                    <span className="track-label">V1</span>
                    <div className="clip video-clip" style={{ left: '0%', width: '100%' }}>Shot_01.mp4</div>
                  </div>
                </>
              )}
            </div>
            <div className="playhead" style={{ left: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoPlayer;
