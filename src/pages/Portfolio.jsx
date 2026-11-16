import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Camera,
  Music,
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  Clock,
  Headphones,
  Eye,
  Briefcase,
  MapPin,
  Sliders,
  Maximize2,
  Info
} from 'lucide-react';
import { Youtube } from '../components/BrandIcons';
import {
  portfolioAbout,
  photoCategories,
  portfolioPhotos,
  musicGenres,
  portfolioMusic,
  videoCategories,
  portfolioVideos
} from '../data/portfolioData';
import './Portfolio.css';

const SLIDES = [
  { id: 'about', label: 'About', icon: User, title: 'About DS3 Studio & Creative Vision' },
  { id: 'photos', label: 'Photos', icon: Camera, title: 'Photography & Visual Stills' },
  { id: 'music', label: 'Music', icon: Music, title: 'Music Production & Sound Lab' },
  { id: 'videos', label: 'Videos', icon: Film, title: 'Cinematic Films & Video Portfolio' }
];

const Portfolio = () => {
  // Navigation / Slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 0: About, 1: Photos, 2: Music, 3: Videos
  const [showAllSections, setShowAllSections] = useState(false);
  const [showGuideTip, setShowGuideTip] = useState(true);

  // Sub-category filters
  const [activePhotoCat, setActivePhotoCat] = useState('All');
  const [activeMusicGenre, setActiveMusicGenre] = useState('All');
  const [activeVideoCat, setActiveVideoCat] = useState('All');

  // Modals state
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(portfolioMusic[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Audio Lifecycle
  useEffect(() => {
    if (!currentTrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }

    const audio = new Audio(currentTrack.audioUrl);
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTimeFormatted(formatTime(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDurationFormatted(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    const handleError = () => {
      console.warn('Audio playback error on track:', currentTrack.title);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (isPlayingRef.current) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [currentTrack]);

  // Volume handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newPercent = parseFloat(e.target.value);
    setAudioProgress(newPercent);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newPercent / 100) * audioRef.current.duration;
    }
  };

  // Slide navigation helpers
  const goToSlide = (index) => {
    setShowAllSections(false);
    setCurrentSlideIndex(index);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const nextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  };

  // Filtered lists
  const filteredPhotos = portfolioPhotos.filter((p) =>
    activePhotoCat === 'All' ? true : p.category === activePhotoCat
  );

  const filteredMusic = portfolioMusic.filter((m) =>
    activeMusicGenre === 'All' ? true : m.genre === activeMusicGenre
  );

  const filteredVideos = portfolioVideos.filter((v) =>
    activeVideoCat === 'All' ? true : v.category === activeVideoCat
  );

  // Lightbox navigation
  const openLightbox = (index) => {
    setActiveLightboxIndex(index);
  };

  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
    }
  };

  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <div className="portfolio-page">
      {/* Page Header */}
      <header className="portfolio-header">
        <div className="portfolio-badge">
          <Sparkles size={14} />
          <span>DS3 Creative Portfolio</span>
        </div>
        <h1 className="portfolio-title">
          Our Work <span className="text-gradient">Portfolio</span>
        </h1>
        <p className="portfolio-subtitle">
          Explore our complete showcase across filmmaking, photography, music production, and sound design.
        </p>

        {/* User Guide Pill */}
        {showGuideTip && (
          <div className="user-guide-pill glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={20} color="var(--secondary)" />
              <span>
                <strong>Easy Fill:</strong> You can edit or add your own photos, music & videos anytime inside{' '}
                <code>src/data/portfolioData.js</code>.
              </span>
            </div>
            <button
              onClick={() => setShowGuideTip(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </header>

      {/* Slide Deck Controller */}
      <div className="portfolio-slide-controller">
        <div className="slide-tabs">
          {SLIDES.map((slide, idx) => {
            const Icon = slide.icon;
            const isActive = !showAllSections && currentSlideIndex === idx;
            return (
              <button
                key={slide.id}
                className={`slide-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                <Icon size={18} />
                <span>{slide.label}</span>
                <span className="tab-badge">{idx + 1}</span>
              </button>
            );
          })}
          <button
            className={`slide-tab-btn ${showAllSections ? 'active' : ''}`}
            onClick={() => setShowAllSections(!showAllSections)}
          >
            <Layers size={18} />
            <span>View All</span>
          </button>
        </div>

        {!showAllSections && (
          <div className="slide-sub-nav">
            <button
              className="slide-nav-arrow-btn"
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={16} /> Previous Slide
            </button>

            <div className="slide-indicator-text">
              Slide {currentSlideIndex + 1} of {SLIDES.length} :{' '}
              <strong style={{ color: 'var(--secondary)' }}>
                {SLIDES[currentSlideIndex].label}
              </strong>
              <div className="slide-dots">
                {SLIDES.map((_, idx) => (
                  <span
                    key={idx}
                    className={`slide-dot ${currentSlideIndex === idx ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                  />
                ))}
              </div>
            </div>

            <button
              className="slide-nav-arrow-btn"
              onClick={nextSlide}
              disabled={currentSlideIndex === SLIDES.length - 1}
            >
              Next Slide <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
          SLIDE 1: ABOUT SECTION
          ==================================================================== */}
      {(showAllSections || currentSlideIndex === 0) && (
        <section className="about-slide-wrapper" id="portfolio-about">
          <div className="about-hero-card glass-panel">
            <div className="about-hero-grid">
              <div className="about-hero-text">
                <span className="about-meta-tag">
                  <MapPin size={16} /> {portfolioAbout.location}
                </span>
                <h2 className="about-headline">
                  {portfolioAbout.bioHeadline}
                </h2>
                <div className="about-paragraphs">
                  {portfolioAbout.bioParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="about-creator-card">
                <div className="creator-avatar-wrap">
                  <img
                    src="/ds3_logo.jpg"
                    alt="DS3 Studio"
                    className="creator-avatar"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <span className="creator-status-badge" title="Available for projects" />
                </div>
                <h3 className="creator-name">{portfolioAbout.name}</h3>
                <p className="creator-role">{portfolioAbout.tagline}</p>
                <Link to="/contact" className="btn-primary creator-cta-btn">
                  Work With Us
                </Link>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="stats-grid">
            {portfolioAbout.stats.map((stat, i) => (
              <div key={i} className="stat-card glass-panel">
                <div className="stat-icon">
                  {stat.icon === 'Briefcase' && <Briefcase size={28} />}
                  {stat.icon === 'Clock' && <Clock size={28} />}
                  {stat.icon === 'Headphones' && <Headphones size={28} />}
                  {stat.icon === 'Eye' && <Eye size={28} />}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Creative Specialties */}
          <h3 className="section-subtitle-heading">
            <Sparkles size={22} color="var(--secondary)" /> Creative Specialties
          </h3>
          <div className="specialties-grid">
            {portfolioAbout.specialties.map((spec, i) => (
              <div key={i} className="specialty-card glass-panel">
                <div className="specialty-icon-box">
                  {spec.icon === 'Camera' && <Camera size={24} />}
                  {spec.icon === 'Music' && <Music size={24} />}
                  {spec.icon === 'Sparkles' && <Sparkles size={24} />}
                  {spec.icon === 'Film' && <Film size={24} />}
                </div>
                <h4 className="specialty-title">{spec.title}</h4>
                <p className="specialty-desc">{spec.desc}</p>
              </div>
            ))}
          </div>

          {/* Software & Gear Stack */}
          <h3 className="section-subtitle-heading" style={{ marginTop: '30px' }}>
            <Sliders size={22} color="var(--secondary)" /> Software, DAWs & Hardware Gear
          </h3>
          <div className="gear-grid">
            {portfolioAbout.gearStack.map((group, i) => (
              <div key={i} className="gear-card glass-panel">
                <h4>{group.category}</h4>
                <div className="gear-tags">
                  {group.items.map((tool, idx) => (
                    <span key={idx} className="gear-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          SLIDE 2: PHOTOS SECTION
          ==================================================================== */}
      {(showAllSections || currentSlideIndex === 1) && (
        <section className="photos-slide-wrapper" id="portfolio-photos" style={{ marginTop: showAllSections ? '60px' : '0' }}>
          {showAllSections && (
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
              Photography <span className="text-gradient">Gallery</span>
            </h2>
          )}

          {/* Category Filter Pills */}
          <div className="category-filter-bar">
            {photoCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${activePhotoCat === cat ? 'active' : ''}`}
                onClick={() => setActivePhotoCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photography Grid */}
          <div className="photos-grid">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`photo-card ${photo.aspect === 'portrait' ? 'portrait' : ''}`}
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="photo-image"
                  loading="lazy"
                />
                <div className="photo-zoom-hint">
                  <Maximize2 size={18} />
                </div>
                <div className="photo-overlay">
                  <span className="photo-category-pill">{photo.category}</span>
                  <h4 className="photo-card-title">{photo.title}</h4>
                  <p className="photo-card-desc">{photo.description}</p>
                  <span className="photo-card-location">
                    <MapPin size={12} /> {photo.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          SLIDE 3: MUSIC SECTION (WITH GENRE FILTERING)
          ==================================================================== */}
      {(showAllSections || currentSlideIndex === 2) && (
        <section className="music-slide-wrapper" id="portfolio-music" style={{ marginTop: showAllSections ? '60px' : '0' }}>
          {showAllSections && (
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
              Music Production & <span className="text-gradient">Sound Lab</span>
            </h2>
          )}

          {/* Genre Filter Pills */}
          <div className="category-filter-bar">
            {musicGenres.map((genre) => (
              <button
                key={genre}
                className={`filter-chip ${activeMusicGenre === genre ? 'active' : ''}`}
                onClick={() => setActiveMusicGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Persistent Player Banner */}
          {currentTrack && (
            <div className="music-player-panel glass-panel">
              <div className="player-inner-grid">
                <div className="player-track-info">
                  <img
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="player-cover-thumb"
                  />
                  <div className="player-track-meta">
                    <h4>{currentTrack.title}</h4>
                    <p>{currentTrack.genre} • {currentTrack.bpm}</p>
                  </div>
                  <div className={`waveform-bars ${isPlaying ? 'playing' : ''}`}>
                    <span className="waveform-bar" />
                    <span className="waveform-bar" />
                    <span className="waveform-bar" />
                    <span className="waveform-bar" />
                    <span className="waveform-bar" />
                  </div>
                </div>

                <div className="player-controls-wrap">
                  <div className="player-buttons">
                    <button
                      className="play-toggle-btn"
                      onClick={() => togglePlayTrack(currentTrack)}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                    </button>
                  </div>

                  <div className="player-progress-bar-wrap">
                    <span className="progress-time-text">{currentTimeFormatted}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioProgress}
                      onChange={handleSeek}
                      className="progress-slider"
                      aria-label="Seek track position"
                    />
                    <span className="progress-time-text">{durationFormatted}</span>
                  </div>
                </div>

                <div className="player-volume-wrap">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="volume-slider"
                    aria-label="Volume control"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Music Tracks Grid */}
          <div className="music-tracks-grid">
            {filteredMusic.map((track) => {
              const isThisTrackPlaying = isPlaying && currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={`music-card glass-panel ${isThisTrackPlaying ? 'currently-playing' : ''}`}
                >
                  <div className="music-card-header">
                    <div className="music-card-artwork-wrap">
                      <img src={track.coverImage} alt={track.title} className="music-card-artwork" />
                      <button
                        className="music-card-play-btn"
                        onClick={() => togglePlayTrack(track)}
                        title={isThisTrackPlaying ? 'Pause Track' : 'Play Track'}
                      >
                        {isThisTrackPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
                      </button>
                    </div>

                    <div className="music-card-info">
                      <h3>{track.title}</h3>
                      <div className="music-card-meta">
                        <span className="music-genre-badge">{track.genre}</span>
                        <span className="music-bpm-tag">{track.bpm}</span>
                        <span className="music-bpm-tag">• {track.key}</span>
                      </div>
                    </div>
                  </div>

                  <p className="music-desc">{track.description}</p>

                  <div className="music-card-footer">
                    <span>Duration: {track.duration}</span>
                    {track.externalLink && (
                      <a
                        href={track.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="music-external-link"
                      >
                        Listen On YouTube <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          SLIDE 4: VIDEOS SECTION (Cinematic Vid, Reels, Podcast, shortfilm)
          ==================================================================== */}
      {(showAllSections || currentSlideIndex === 3) && (
        <section className="videos-slide-wrapper" id="portfolio-videos" style={{ marginTop: showAllSections ? '60px' : '0' }}>
          {showAllSections && (
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
              Films & <span className="text-gradient">Video Creations</span>
            </h2>
          )}

          {/* Category Filter Pills (Exact categories requested) */}
          <div className="category-filter-bar">
            {videoCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${activeVideoCat === cat ? 'active' : ''}`}
                onClick={() => setActiveVideoCat(cat)}
              >
                {cat === 'Cinematic Vid' && '🎬 '}
                {cat === 'Reels' && '📱 '}
                {cat === 'Podcast' && '🎙️ '}
                {cat === 'shortfilm' && '🎞️ '}
                {cat}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="videos-grid">
            {filteredVideos.map((video) => {
              const isReel = video.category === 'Reels' || video.aspect === '9:16';
              return (
                <div
                  key={video.id}
                  className={`video-card glass-panel ${isReel ? 'reel-card' : ''}`}
                >
                  <div
                    className={isReel ? 'reel-thumb-wrap' : 'video-thumb-wrap'}
                    onClick={() => setActiveVideoModal(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="video-thumb"
                      loading="lazy"
                    />
                    <div className="video-play-overlay">
                      <div className="video-play-circle">
                        <Play size={24} style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                    <span className="video-category-badge">{video.category}</span>
                    <span className="video-duration-badge">{video.duration}</span>
                    {isReel && video.views && (
                      <span className="reel-views-pill">
                        <Eye size={12} /> {video.views}
                      </span>
                    )}
                  </div>

                  <div className="video-content-body">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-client-role">{video.client}</p>
                    <p className="video-desc">{video.description}</p>
                    <div className="video-tags-wrap">
                      {video.tags?.map((tag, idx) => (
                        <span key={idx} className="video-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          MODAL 1: PHOTO LIGHTBOX
          ==================================================================== */}
      {activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex] && (
        <div className="portfolio-modal-backdrop" onClick={() => setActiveLightboxIndex(null)}>
          <div className="lightbox-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveLightboxIndex(null)}>
              <X size={20} />
            </button>

            <button className="lightbox-arrow-btn prev" onClick={prevLightbox}>
              <ChevronLeft size={24} />
            </button>

            <div className="lightbox-image-wrap">
              <img
                src={filteredPhotos[activeLightboxIndex].imageUrl}
                alt={filteredPhotos[activeLightboxIndex].title}
              />
            </div>

            <button className="lightbox-arrow-btn next" onClick={nextLightbox}>
              <ChevronRight size={24} />
            </button>

            <div className="lightbox-footer-info">
              <h3>{filteredPhotos[activeLightboxIndex].title}</h3>
              <p>
                {filteredPhotos[activeLightboxIndex].description} •{' '}
                <span style={{ color: 'var(--secondary)' }}>
                  {filteredPhotos[activeLightboxIndex].location}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: VIDEO PLAYER MODAL
          ==================================================================== */}
      {activeVideoModal && (
        <div className="portfolio-modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveVideoModal(null)}>
              <X size={20} />
            </button>

            <div
              className={`video-frame-container ${
                activeVideoModal.aspect === '9:16' || activeVideoModal.category === 'Reels'
                  ? 'vertical-reel-frame'
                  : ''
              }`}
            >
              {activeVideoModal.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideoModal.videoUrl ? (
                <video src={activeVideoModal.videoUrl} controls autoPlay />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
                  Video Preview Coming Soon
                </div>
              )}
            </div>

            <div className="video-modal-meta">
              <span className="video-category-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '8px' }}>
                {activeVideoModal.category}
              </span>
              <h3>{activeVideoModal.title}</h3>
              <p className="video-modal-sub">{activeVideoModal.client} • {activeVideoModal.duration}</p>
              <p className="video-modal-desc">{activeVideoModal.description}</p>
              {activeVideoModal.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoModal.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <Youtube size={18} /> Watch on YouTube <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
