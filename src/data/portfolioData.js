/**
 * ============================================================================
 * 📁 DS3 STUDIO - WORK PORTFOLIO DATA
 * ============================================================================
 * 
 * 💡 USER INSTRUCTIONS / தமிழ் வழிகாட்டி:
 * ----------------------------------------------------------------------------
 * நீங்க இந்த ஃபைலில் உள்ள தகவல்களை (Photos, Music, Videos, About) 
 * மிக எளிதாக மாற்றிக் கொள்ளலாம் அல்லது புதிய ஐட்டங்களை add செய்து கொள்ளலாம்!
 * 
 * 1. PHOTOS  : `portfolioPhotos` list-ல் புதிய image URL & title add பண்ணலாம்.
 * 2. MUSIC   : `portfolioMusic` list-ல் genre, title, audio preview URL add பண்ணலாம்.
 * 3. VIDEOS  : `portfolioVideos` list-ல் (Cinematic Vid, Reels, Podcast, shortfilm)
 *              category வாரியாக YouTube link / Video URL add பண்ணலாம்.
 * 4. ABOUT   : `portfolioAbout` object-ல் உங்கள் bio, skills, gear details மாற்றலாம்.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. ABOUT SECTION DATA
// ----------------------------------------------------------------------------
export const portfolioAbout = {
  name: "DS3 Studio",
  creatorName: "Dhanush S (DS3)",
  tagline: "Sound. Vision. Story.",
  location: "Coorg (Kodagu), Karnataka",
  bioHeadline: "Cinematic Visuals & Heavy Soundscapes Rooted in Kodagu",
  bioParagraphs: [
    "DS3 Studio is a full-spectrum digital media, music production, filmmaking, and post-production creative lab based in Coorg (Kodagu), Karnataka. We craft work that blends modern cinematic techniques, evocative sound design, and authentic storytelling.",
    "From cinematic video editing, drone photography, and Hollywood-grade color grading in DaVinci Resolve to full music compositions, EDM Valaga fusions, and DAW templates (FL Studio, Logic Pro, Ableton Live), our goal is to turn ambitious ideas into memorable audiovisual experiences.",
    "Whether it is an energetic commercial reel, an engaging multi-mic podcast, an atmospheric short film, or a festival-ready musical composition, every frame and waveform is treated with precision and passion."
  ],
  stats: [
    { label: "Completed Projects", value: "180+", icon: "Briefcase" },
    { label: "Hours of Content", value: "650+", icon: "Clock" },
    { label: "Audio Productions", value: "75+", icon: "Headphones" },
    { label: "Social Impressions", value: "1.2M+", icon: "Eye" }
  ],
  specialties: [
    {
      title: "Cinematography & Drone",
      desc: "4K cinematic travel, aerial drone sweeps across Kodagu hills, and commercial camera work.",
      icon: "Camera"
    },
    {
      title: "Sound Design & Music",
      desc: "EDM Valaga fusions, cinematic BGMs, DAW templates, vocal processing & mastering.",
      icon: "Music"
    },
    {
      title: "Color Grading & VFX",
      desc: "DaVinci Resolve studio colorist workflows, ACES color science, custom cinematic LUTs.",
      icon: "Sparkles"
    },
    {
      title: "Reels & High-Paced Cuts",
      desc: "Dynamic vertical reels, viral sound sync, smooth speed ramps, and engaging typography.",
      icon: "Film"
    }
  ],
  gearStack: [
    { category: "Video Software", items: ["DaVinci Resolve Studio", "Adobe Premiere Pro", "After Effects", "Blender"] },
    { category: "Audio DAWs", items: ["FL Studio 21", "Logic Pro X", "Ableton Live 11", "Cubase Pro"] },
    { category: "Hardware & Cameras", items: ["Sony FX3 / A7S III", "DJI Mavic Air 2S Drone", "Rode Wireless Pro", "Focusrite Audio Interface"] }
  ]
};

// ----------------------------------------------------------------------------
// 2. PHOTOS SECTION DATA
// ----------------------------------------------------------------------------
export const photoCategories = [
  "All",
  "Cinematic Stills",
  "Portraits",
  "Landscape & Drone",
  "Behind The Scenes"
];

export const portfolioPhotos = [
  {
    id: "p1",
    title: "Misty Western Ghats",
    category: "Landscape & Drone",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    description: "Aerial dawn sweep over the foggy mountain canopies of Kodagu.",
    location: "Kodagu, Coorg",
    aspect: "landscape"
  },
  {
    id: "p2",
    title: "Cinematic Film Still",
    category: "Cinematic Stills",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    description: "Anamorphic framing and dramatic cyan-orange color grading.",
    location: "Studio Stage A",
    aspect: "landscape"
  },
  {
    id: "p3",
    title: "Studio Sound Board",
    category: "Behind The Scenes",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    description: "Late night mixing and sound design session on the hardware console.",
    location: "DS3 Audio Lab",
    aspect: "landscape"
  },
  {
    id: "p4",
    title: "Artist Portrait in Neon",
    category: "Portraits",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    description: "Low-key portrait session with dual rim-lighting and haze.",
    location: "Bangalore",
    aspect: "portrait"
  },
  {
    id: "p5",
    title: "Coffee Plantation Canopy",
    category: "Landscape & Drone",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    description: "Lush green coffee estate morning light, Kodagu heritage.",
    location: "Madikeri, Coorg",
    aspect: "landscape"
  },
  {
    id: "p6",
    title: "Director on Location",
    category: "Behind The Scenes",
    imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80",
    description: "Rigging the camera gimbal for the outdoor narrative sequence.",
    location: "Outdoor Set",
    aspect: "portrait"
  },
  {
    id: "p7",
    title: "Night City Light Trails",
    category: "Cinematic Stills",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    description: "Long exposure color streak test for the music video intro.",
    location: "City Highway",
    aspect: "landscape"
  },
  {
    id: "p8",
    title: "Musician Session Cut",
    category: "Portraits",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    description: "Acoustic recording breakdown and vocal tracking session.",
    location: "Vocal Booth",
    aspect: "portrait"
  }
];

// ----------------------------------------------------------------------------
// 3. MUSIC SECTION DATA (WITH GENRES)
// ----------------------------------------------------------------------------
export const musicGenres = [
  "All",
  "EDM & Valaga Fusion",
  "Cinematic & Score",
  "Lo-Fi & Ambient",
  "Trap & Hip-Hop",
  "Commercial BGM"
];

export const portfolioMusic = [
  {
    id: "m1",
    title: "Kodava Valaga EDM Beat",
    genre: "EDM & Valaga Fusion",
    artist: "DS3 Studio",
    duration: "3:18",
    bpm: "128 BPM",
    key: "F minor",
    description: "High-energy festival fusion combining traditional Kodava drums (Valaga) with heavy sub-bass and modern synthesizers.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  },
  {
    id: "m2",
    title: "Misty Hills Cinematic Theme",
    genre: "Cinematic & Score",
    artist: "DS3 Studio",
    duration: "2:54",
    bpm: "78 BPM",
    key: "D minor",
    description: "Lush orchestral strings and ambient drone pad crafted for scenic travel documentaries and film openers.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  },
  {
    id: "m3",
    title: "Midnight Coorg Rain Lo-Fi",
    genre: "Lo-Fi & Ambient",
    artist: "DS3 Studio",
    duration: "2:30",
    bpm: "84 BPM",
    key: "C Major",
    description: "Relaxed vinyl crackle, warm Rhodes piano chords, and soothing Kodagu monsoon rain ambience.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3",
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  },
  {
    id: "m4",
    title: "Cyberpunk 808 Hard Drop",
    genre: "Trap & Hip-Hop",
    artist: "DS3 Studio",
    duration: "2:42",
    bpm: "140 BPM",
    key: "G# minor",
    description: "Distorted 808 slides, drill percussion, and metallic lead synth designed for punchy action reels and hype edits.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  },
  {
    id: "m5",
    title: "Brand Anthem Corporate BGM",
    genre: "Commercial BGM",
    artist: "DS3 Studio",
    duration: "2:15",
    bpm: "115 BPM",
    key: "A Major",
    description: "Uplifting acoustic guitar strumming, bright hand-claps, and motivational piano build for corporate adverts.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  },
  {
    id: "m6",
    title: "Thunder Valaga Club Rework",
    genre: "EDM & Valaga Fusion",
    artist: "DS3 Studio",
    duration: "3:35",
    bpm: "130 BPM",
    key: "E minor",
    description: "Heavy club bassline layered with authentic brass blasts and folk Kodava percussions.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    externalLink: "https://youtube.com/@ds3-official?si=WNYzp9ShxgMh87Mr"
  }
];

// ----------------------------------------------------------------------------
// 4. VIDEOS SECTION DATA
// Categories explicitly requested:
// ['Cinematic Vid', 'Reels', 'Podcast', 'shortfilm']
// ----------------------------------------------------------------------------
export const videoCategories = [
  "All",
  "Cinematic Vid",
  "Reels",
  "Podcast",
  "shortfilm"
];

export const portfolioVideos = [
  {
    id: "v1",
    title: "Echoes of Kodagu - The Western Ghats Journey",
    category: "Cinematic Vid",
    duration: "03:45",
    client: "Travel & Culture Feature",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "", // Direct MP4 if available
    description: "A cinematic visual travelogue through the mist-shrouded peaks, water cascades, and deep green valleys of Coorg.",
    tags: ["4K Cine", "DaVinci Color", "Drone Cinematography", "Sound Design"]
  },
  {
    id: "v2",
    title: "Speed Ramp & Sound Design Trend",
    category: "Reels",
    duration: "00:30",
    client: "Viral Instagram Edit",
    aspect: "9:16",
    views: "245K",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "Fast-paced vertical reel featuring match cuts, optical flow speed ramps, and seamless audio whooshes.",
    tags: ["9:16 Vertical", "Speed Ramp", "Viral Audio", "Premiere Pro"]
  },
  {
    id: "v3",
    title: "Behind The Mic: Music Creators Podcast Ep. 04",
    category: "Podcast",
    duration: "24:18",
    client: "Studio Talk Series",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "Multi-camera podcast cut with automated speaker switching, noise-reduction audio processing, and color-matched angles.",
    tags: ["Multi-Cam Cut", "Studio Audio", "Podcast Edit", "Color Match"]
  },
  {
    id: "v4",
    title: "Nizhal (The Shadow) - Mystery Short Film",
    category: "shortfilm",
    duration: "14:20",
    client: "Independent Film Festival",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "Psychological thriller short film. Complete post-production handled by DS3 Studio: offline cut, soundscape, Foley, and 2.39:1 anamorphic grading.",
    tags: ["Narrative Cut", "Foley & SFX", "Anamorphic", "Festival Selection"]
  },
  {
    id: "v5",
    title: "Mountain Monsoons - 4K Visual Experience",
    category: "Cinematic Vid",
    duration: "04:12",
    client: "Nature Documentary",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "Slow-motion rain drops, deep thunder audio mastering, and drone fly-throughs in heavy rain conditions.",
    tags: ["4K HDR", "Drone Cine", "Natural Ambience", "Soundscapes"]
  },
  {
    id: "v6",
    title: "Automotive Cine Reel - Turbo Night Drive",
    category: "Reels",
    duration: "00:25",
    client: "Motorsports Promo",
    aspect: "9:16",
    views: "180K",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "High-octane car exhaust audio sync, glow streaks, camera whip pans, and glitch transitions.",
    tags: ["9:16 Reel", "Exhaust SFX", "Whip Pans", "Color Grade"]
  },
  {
    id: "v7",
    title: "The Indie Director Roundtable - Studio Podcast",
    category: "Podcast",
    duration: "32:10",
    client: "Creative Dialogue",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "In-depth conversation with local filmmakers on low-budget production hacks, color science, and editing workflows.",
    tags: ["3-Camera Setup", "Lavalier Mics", "Studio Lighting", "Podcast"]
  },
  {
    id: "v8",
    title: "The Last Melody - Drama Short Film",
    category: "shortfilm",
    duration: "11:55",
    client: "Student Showcase",
    aspect: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "LXb3EKWsInQ", // Replace with unga YouTube Video ID
    videoUrl: "",
    description: "Emotional story of an aged Kodava musician passing his art to the younger generation. Original background score produced at DS3 Studio.",
    tags: ["Drama", "Original Score", "Kodava Culture", "DaVinci Resolve"]
  }
];
