import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialProducts = [
  {
    id: 1,
    title: "FL Studio Master Template",
    description: "Industry-standard mixing & mastering template for FL Studio 21+.",
    price: "₹29.99",
    image: "/music_production_hero.jpg",
    color: "#ff7b00",
    features: ["Pre-routed Mixer Tracks", "Vocal Chain Presets", "Stock Plugins Only", "Bonus Sample Pack"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_1"
  },
  {
    id: 2,
    title: "Logic Pro Vocal Chain",
    description: "Get pristine vocals instantly with our premium Logic Pro X channel strips.",
    price: "₹34.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#00a8ff",
    features: ["Pop & Rap Vocal Presets", "Zero Latency Recording", "Mastering Chain Included", "Easy to install"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_2"
  },
  {
    id: 3,
    title: "Ableton Live Synth Presets",
    description: "100+ Serum & Vital presets tailored for Ableton Live 11+.",
    price: "₹24.99",
    image: "/music_production_hero.jpg",
    color: "#00ff88",
    features: ["100+ Premium Presets", "Macros Pre-mapped", "Ableton Racks", "Future Bass & Trap"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_3"
  },
  {
    id: 4,
    title: "Cubase Orchestral Template",
    description: "Massive orchestral routing template for Cubase Pro.",
    price: "₹49.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#ff0054",
    features: ["Kontakt Routing", "Expression Maps", "Color Coded Tracks", "Stem Export Ready"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_4"
  },
  {
    id: 5,
    title: "Studio One Mixing Preset",
    description: "Pro mixing console presets designed for Studio One 6.",
    price: "₹29.99",
    image: "/music_production_hero.jpg",
    color: "#4facfe",
    features: ["Fat Drum Bus", "Silky Reverb Sends", "Analog Style Saturation", "Quick Mix Setup"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_5"
  }
];

export const AppContextProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ds3_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('ds3_settings');
    return saved ? JSON.parse(saved) : { logoUrl: '/ds3_logo.jpg' };
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ds3_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ds3_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ds3_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('ds3_orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <AppContext.Provider value={{ products, setProducts, siteSettings, setSiteSettings, orders, setOrders }}>
      {children}
    </AppContext.Provider>
  );
};
