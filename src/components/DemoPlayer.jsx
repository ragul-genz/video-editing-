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

  const isVocal = activeDemo?.includes('Vocal');
  const isTemplate = activeDemo?.includes('Template');

  useEffect(() => {
    if (isPlaying) {
      if (!isVocal && !isTemplate && progress === 40) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  }, [progress, isPlaying, isVocal, isTemplate]);

  const handlePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(true);
    if (isVocal) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

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
            <div className="editor-title">{isVocal ? 'Vocal_Chain.logicx' : (isTemplate ? 'Master_Template.flp' : 'Synth_Presets.als')}</div>
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
                  <span>{isVocal ? 'Click to Listen to Vocal Chain' : (isTemplate ? 'Click to Preview Template' : 'Click to Listen to Synth Presets')}</span>
                </div>
              ) : (
                <div className="video-content" onClick={() => setIsPlaying(false)}>
                  {isVocal ? (
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
                      <div className="sfx-title">Lead_Vocal_Processed.wav</div>
                    </div>
                  ) : isTemplate ? (
                    <div className="audio-visualizer" style={{ background: '#1a1a2e' }}>
                       <div className="waveform-container" style={{ opacity: 0.5 }}>
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="bar" 
                            style={{ 
                              height: isPlaying ? `${Math.random() * 60 + 10}%` : '5%',
                              background: '#00a8ff'
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="sfx-title">Mastering_Chain_Active</div>
                    </div>
                  ) : (
                    <div className="audio-visualizer" style={{ background: '#0f2027' }}>
                      <div className="waveform-container">
                        <div className="sfx-title" style={{ fontSize: '2rem', color: '#00ff88', textShadow: '0 0 10px #00ff88' }}>
                          {isPlaying ? '🎹 Synthesizer Playing...' : '🎹 Ready to Play'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Mockup */}
          <div className="timeline-mockup">
            <div className="timeline-tracks">
              {!isVocal && !isTemplate && (
                <>
                  <div className="track a-track">
                    <span className="track-label">MIDI 1</span>
                    <div className="clip fx-clip" style={{ left: '10%', width: '30%', background: '#00ff88' }}>Serum Lead</div>
                    <div className="clip fx-clip" style={{ left: '50%', width: '40%', background: '#00ff88' }}>Serum Pluck</div>
                  </div>
                  <div className="track a-track">
                    <span className="track-label">Audio</span>
                    <div className="clip video-clip" style={{ left: '5%', width: '90%' }}>Drum_Loop.wav</div>
                  </div>
                </>
              )}
              {isVocal && (
                <>
                  <div className="track a-track">
                    <span className="track-label">Vocal</span>
                    <div className="clip fx-clip" style={{ left: '20%', width: '60%', background: '#00a8ff' }}>Lead_Vocal_Take1.wav</div>
                  </div>
                  <div className="track a-track">
                    <span className="track-label">Beat</span>
                    <div className="clip audio-clip" style={{ left: '0%', width: '100%' }}>Instrumental.wav</div>
                  </div>
                </>
              )}
              {isTemplate && (
                <>
                  <div className="track a-track">
                    <span className="track-label">Master</span>
                    <div className="clip fx-clip" style={{ left: '0%', width: '100%', background: '#ff7b00', color: '#fff' }}>Ozone 10 / Limiter</div>
                  </div>
                  <div className="track a-track">
                    <span className="track-label">Mix Bus</span>
                    <div className="clip video-clip" style={{ left: '0%', width: '100%' }}>Full_Mix_Sum.wav</div>
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
