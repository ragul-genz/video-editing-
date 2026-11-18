import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, X, FolderGit2, Disc3, Film } from 'lucide-react';
import './About.css';

// ============================================================================
// 💡 USER INSTRUCTIONS / தமிழ் வழிகாட்டி:
// ----------------------------------------------------------------------------
// இங்க உங்க சொந்த Music & Videos Google Drive Links மற்றும் Coverpage Links மாற்றலாம்:
// ============================================================================
const WORK_LINKS = {
  music: {
    // 👉 [EDIT HERE] Paste your Music Google Drive folder link:
    driveLink: "https://drive.google.com/drive/folders/placeholder_music_ds3",
    coverpageTitle: "DS3 Music & Sound Design Coverpage",
    coverpageImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    description: "Explore our complete original audio lab: BGMs, DAW Master Templates, Cinematic Scores, EDM Valaga Fusions & SFX."
  },
  videos: {
    // 👉 [EDIT HERE] Paste your Videos Google Drive folder link:
    driveLink: "https://drive.google.com/drive/folders/placeholder_videos_ds3",
    coverpageTitle: "DS3 Cinematic Films & Video Portfolio",
    coverpageImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    description: "Watch our high-end 4K video creations: Cinematic travel films, viral Instagram reels, studio podcasts, and festival short films."
  }
};

const About = () => {
  const [activeCoverModal, setActiveCoverModal] = useState(null); // 'music' | 'videos' | null

  return (
    <div className="about-page-container">
      {/* Top Header */}
      <div className="about-header-wrap">
        <h1 className="about-main-title">
          About <span className="text-gradient">DS3 Studio</span>
        </h1>
      </div>

      {/* Main Narrative Paragraphs */}
      <div className="about-text-content">
        <p className="about-paragraph">
          <strong>DS3 Studio</strong> is a creative digital media, music production, filmmaking, and post-production venture based in <strong>Coorg (Kodagu), Karnataka</strong>. We combine technology, sound, visuals, and storytelling to create work that feels modern, cinematic, and rooted in authentic local culture.
        </p>

        <p className="about-paragraph">
          From <strong>music production and sound design</strong> to <strong>video editing, color grading, motion graphics, LUTs, presets, and complete film post-production</strong>, DS3 Studio provides professional creative solutions for artists, filmmakers, content creators, and brands.
        </p>

        <p className="about-paragraph">
          Our music production work includes <strong>DAW templates, vocal chains, synth presets, sound-design tools, and production resources</strong> designed for workflows across <strong>FL Studio, Logic Pro, Ableton Live, Cubase, Studio One, Pro Tools, and other industry-standard platforms</strong>.
        </p>

        <p className="about-paragraph">
          On the filmmaking side, DS3 Studio specializes in <strong>cinematic video editing, color correction and grading, visual effects, motion graphics, audio post-production, and finishing</strong>. Our creative work also celebrates the landscapes and cultural heritage of Kodagu through <strong>cinematic drone visuals and EDM-infused interpretations of traditional Kodava music</strong>, including the energetic Valaga sound.
        </p>

        <div className="about-quote-box">
          At DS3 Studio, our goal is simple: <strong>turn creative ideas into powerful sound and striking visuals.</strong> Whether it's a song, music project, film, commercial, documentary, or digital campaign, we bring together professional post-production expertise and a distinctive cinematic identity.
          <strong className="about-motto">DS3 Studio — Sound. Vision. Story.</strong>
        </div>
      </div>

      {/* ====================================================================
          OUR WORK SECTION (EXACT MOCKUP FROM page 01.svg)
          ==================================================================== */}
      <section className="our-work-section">
        <h2 className="our-work-title">OUR <span>WORK</span></h2>

        <div className="our-work-capsule">
          {/* Left Column: MUSIC */}
          <div className="work-capsule-col">
            <h3 className="work-col-heading">MUSIC</h3>
            <p className="work-col-subcategories">
              BGM, MUSIC , CINEMATIC , SFX ,
            </p>

            <div className="work-col-links-group">
              <a
                href={WORK_LINKS.music.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="work-red-link-item"
                title="Open Music Google Drive Link"
              >
                <span>GOOGLE DRIVE LINK</span>
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                className="work-red-link-item"
                onClick={() => setActiveCoverModal('music')}
                title="View Music Coverpage"
              >
                <span>COVERPAGE</span>
                <Disc3 size={16} />
              </button>
            </div>
          </div>

          {/* Middle Vertical Divider */}
          <div className="work-capsule-divider" />

          {/* Right Column: VIDEOS */}
          <div className="work-capsule-col">
            <h3 className="work-col-heading">VIDEOS</h3>
            <p className="work-col-subcategories">
              CINEMATIC VID , REELS , PODCAST , SHORTFILM
            </p>

            <div className="work-col-links-group">
              <a
                href={WORK_LINKS.videos.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="work-red-link-item"
                title="Open Videos Google Drive Link"
              >
                <span>GOOGLE DRIVE LINK</span>
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                className="work-red-link-item"
                onClick={() => setActiveCoverModal('videos')}
                title="View Videos Coverpage"
              >
                <span>COVERPAGE</span>
                <Film size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          COVERPAGE MODAL PREVIEW (WHEN USER CLICKS 'COVERPAGE')
          ==================================================================== */}
      {activeCoverModal && (
        <div className="coverpage-modal-backdrop" onClick={() => setActiveCoverModal(null)}>
          <div className="coverpage-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="coverpage-modal-close"
              onClick={() => setActiveCoverModal(null)}
              title="Close"
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', maxHeight: '280px' }}>
              <img
                src={WORK_LINKS[activeCoverModal].coverpageImage}
                alt={WORK_LINKS[activeCoverModal].coverpageTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h3 style={{ color: '#fff' }}>{WORK_LINKS[activeCoverModal].coverpageTitle}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {WORK_LINKS[activeCoverModal].description}
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/portfolio"
                className="btn-primary"
                onClick={() => setActiveCoverModal(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Explore Full Portfolio</span>
                <ExternalLink size={16} />
              </Link>

              <a
                href={WORK_LINKS[activeCoverModal].driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px' }}
              >
                <FolderGit2 size={16} />
                <span>Open Google Drive</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
