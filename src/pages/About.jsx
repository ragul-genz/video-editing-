import React from 'react';

const About = () => {
  return (
    <section className="about-section floating-element delay-1" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="section-title">About <span className="text-gradient">DS3 Studio</span></h1>
      <p className="section-subtitle" style={{ maxWidth: '800px', margin: '20px auto', fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'justify' }}>
        <strong>DS3 Studio</strong> is a creative digital media, music production, filmmaking, and post-production venture based in <strong>Coorg (Kodagu), Karnataka</strong>. We combine technology, sound, visuals, and storytelling to create work that feels modern, cinematic, and rooted in authentic local culture.
      </p>
      <p style={{ maxWidth: '800px', margin: '0 auto 20px auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify' }}>
        From <strong>music production and sound design</strong> to <strong>video editing, color grading, motion graphics, LUTs, presets, and complete film post-production</strong>, DS3 Studio provides professional creative solutions for artists, filmmakers, content creators, and brands.
      </p>
      <p style={{ maxWidth: '800px', margin: '0 auto 20px auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify' }}>
        Our music production work includes <strong>DAW templates, vocal chains, synth presets, sound-design tools, and production resources</strong> designed for workflows across <strong>FL Studio, Logic Pro, Ableton Live, Cubase, Studio One, Pro Tools, and other industry-standard platforms</strong>.
      </p>
      <p style={{ maxWidth: '800px', margin: '0 auto 20px auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify' }}>
        On the filmmaking side, DS3 Studio specializes in <strong>cinematic video editing, color correction and grading, visual effects, motion graphics, audio post-production, and finishing</strong>. Our creative work also celebrates the landscapes and cultural heritage of Kodagu through <strong>cinematic drone visuals and EDM-infused interpretations of traditional Kodava music</strong>, including the energetic Valaga sound.
      </p>
      <p style={{ maxWidth: '800px', margin: '0 auto 20px auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'white', textAlign: 'justify', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
        At DS3 Studio, our goal is simple: <strong>turn creative ideas into powerful sound and striking visuals.</strong> Whether it's a song, music project, film, commercial, documentary, or digital campaign, we bring together professional post-production expertise and a distinctive cinematic identity.
        <br/><br/>
        <strong style={{ color: 'var(--primary)', fontSize: '1.2rem', textAlign: 'center', display: 'block' }}>DS3 Studio — Sound. Vision. Story.</strong>
      </p>
    </section>
  );
};

export default About;
