import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const API_URL = 'https://video-editing-h7vr.onrender.com/api';

const initialProducts = [
  {
    title: "FL Studio Master Template",
    description: "Industry-standard mixing & mastering template for FL Studio 21+.",
    price: "₹29.99",
    image: "/music_production_hero.jpg",
    color: "#ff7b00",
    features: ["Pre-routed Mixer Tracks", "Vocal Chain Presets", "Stock Plugins Only", "Bonus Sample Pack"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_1"
  },
  {
    title: "Logic Pro Vocal Chain",
    description: "Get pristine vocals instantly with our premium Logic Pro X channel strips.",
    price: "₹34.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#00a8ff",
    features: ["Pop & Rap Vocal Presets", "Zero Latency Recording", "Mastering Chain Included", "Easy to install"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_2"
  },
  {
    title: "Ableton Live Synth Presets",
    description: "100+ Serum & Vital presets tailored for Ableton Live 11+.",
    price: "₹24.99",
    image: "/music_production_hero.jpg",
    color: "#00ff88",
    features: ["100+ Premium Presets", "Macros Pre-mapped", "Ableton Racks", "Future Bass & Trap"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_3"
  },
  {
    title: "Cubase Orchestral Template",
    description: "Massive orchestral routing template for Cubase Pro.",
    price: "₹49.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#ff0054",
    features: ["Kontakt Routing", "Expression Maps", "Color Coded Tracks", "Stem Export Ready"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_4"
  },
  {
    title: "Studio One Mixing Preset",
    description: "Pro mixing console presets designed for Studio One 6.",
    price: "₹29.99",
    image: "/music_production_hero.jpg",
    color: "#4facfe",
    features: ["Fat Drum Bus", "Silky Reverb Sends", "Analog Style Saturation", "Quick Mix Setup"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_5"
  }
];

const initialReviews = [
  { name: "Alex Mercer", role: "Music Producer", rating: 5, text: "The Logic Pro vocal chain is absolutely insane. Cut my mixing time in half and the vocals sit perfectly in the mix.", userEmail: "alex@example.com", productId: "1" },
  { name: "Sarah J.", role: "Beatmaker", rating: 5, text: "FL Studio Master Template is a game changer. The routing is incredibly clean and intuitive.", userEmail: "sarah@example.com", productId: "2" },
  { name: "DJ Kael", role: "Electronic Artist", rating: 5, text: "Those Ableton Live synth presets are huge. Immediate inspiration right out of the box.", userEmail: "kael@example.com", productId: "3" },
  { name: "Michael R.", role: "Composer", rating: 5, text: "The Cubase orchestral template handles 100+ tracks flawlessly. Expression mapping is on point.", userEmail: "michael@example.com", productId: "4" },
];

export const AppContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const [products, setProductsState] = useState([]);
  const [siteSettings, setSiteSettingsState] = useState({ logoUrl: '/ds3_logo.jpg' });
  const [orders, setOrdersState] = useState([]);
  const [users, setUsersState] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ds3_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [reviews, setReviewsState] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New States
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ds3_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ds3_theme') || 'dark';
  });

  // Helper to fetch data
  const fetchData = async () => {
    try {
      const [prodRes, revRes, userRes, ordRes, setRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/reviews`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/settings`)
      ]);

      // Seed initial data if DB is empty
      if (prodRes.data.length === 0) {
        for (const p of initialProducts) {
          await axios.post(`${API_URL}/products`, p);
        }
        const newProds = await axios.get(`${API_URL}/products`);
        setProductsState(newProds.data);
      } else {
        setProductsState(prodRes.data);
      }

      if (revRes.data.length === 0) {
        for (const r of initialReviews) {
          await axios.post(`${API_URL}/reviews`, r);
        }
        const newRevs = await axios.get(`${API_URL}/reviews`);
        setReviewsState(newRevs.data);
      } else {
        setReviewsState(revRes.data);
      }

      if (userRes.data.length === 0) {
        const defaultUser = { email: 'genzdevoff@gmail.com', password: 'password123' };
        await axios.post(`${API_URL}/users`, defaultUser);
        setUsersState([defaultUser]);
      } else {
        setUsersState(userRes.data);
      }

      setOrdersState(ordRes.data);
      setSiteSettingsState(setRes.data || { logoUrl: '/ds3_logo.jpg' });
      
    } catch (err) {
      console.error("Failed to fetch data from backend:", err);
      // Fallback to initial data to ensure no errors are displayed to the user, with temporary IDs
      setProductsState(initialProducts.map((p, i) => ({ ...p, id: `fallback-${i}` })));
      setReviewsState(initialReviews.map((r, i) => ({ ...r, id: `fallback-${i}` })));
      setUsersState([{ email: 'genzdevoff@gmail.com', password: 'password123' }]);
      setOrdersState([]);
      setSiteSettingsState({ logoUrl: '/ds3_logo.jpg' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('ds3_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ds3_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ds3_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      addToast('Added to wishlist', 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
    addToast('Removed from wishlist', 'success');
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      setCurrentUser(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Wrapper functions for updating state AND backend
  const addProduct = async (product) => {
    try {
      const res = await axios.post(`${API_URL}/products`, product);
      setProductsState(prev => [...prev, res.data]);
      return res.data;
    } catch (err) { 
      console.error(err); 
      throw err;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      if (String(id).startsWith('fallback-')) {
        setProductsState(prev => prev.map(p => p.id === id ? { ...updatedProduct, id } : p));
        return { ...updatedProduct, id };
      }
      const res = await axios.put(`${API_URL}/products/${id}`, updatedProduct);
      setProductsState(prev => prev.map(p => p.id === id ? res.data : p));
      return res.data;
    } catch (err) { 
      console.error(err); 
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Don't call API for fallback items, just remove from local state
      if (!String(id).startsWith('fallback-')) {
        await axios.delete(`${API_URL}/products/${id}`);
      }
      setProductsState(prev => prev.filter(p => p.id !== id));
      addToast("Product deleted successfully", "success");
    } catch (err) { 
      console.error(err); 
      addToast("Failed to delete product", "error");
    }
  };

  const setSiteSettings = async (newSettings) => {
    try {
      const res = await axios.put(`${API_URL}/settings`, newSettings);
      setSiteSettingsState(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const setOrders = async (newOrders) => {
    setOrdersState(newOrders);
  };

  const addOrder = async (order) => {
    try {
      const res = await axios.post(`${API_URL}/orders`, order);
      setOrdersState(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateOrder = async (id, updatedFields) => {
    try {
      const res = await axios.put(`${API_URL}/orders/${id}`, updatedFields);
      setOrdersState(prev => prev.map(o => o.id === id ? res.data : o));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const setUsers = (newUsers) => {
    setUsersState(newUsers);
  };

  const updateUserPassword = async (email, newPassword) => {
    try {
      await axios.put(`${API_URL}/users/${email}`, { password: newPassword });
      setUsersState(prev => prev.map(u => u.email === email ? { ...u, password: newPassword } : u));
      if (currentUser?.email === email) {
        setCurrentUser({ ...currentUser, password: newPassword });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addReview = async (review) => {
    try {
      const res = await axios.post(`${API_URL}/reviews`, review);
      setReviewsState(prev => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id) => {
    try {
      if (!String(id).startsWith('fallback-')) {
        await axios.delete(`${API_URL}/reviews/${id}`);
      }
      setReviewsState(prev => prev.filter(r => r.id !== id));
      addToast("Review deleted successfully", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete review", "error");
    }
  };

  // Since components might be calling setProducts with a new array for edits, 
  // we expose API helper functions for components to use if needed, or we just rely on useEffect in components.
  // We will expose the raw states and wrappers.
  return (
    <AppContext.Provider value={{ 
      products, addProduct, updateProduct, deleteProduct, setProductsState,
      siteSettings, setSiteSettings, 
      orders, setOrders, addOrder, updateOrder,
      users, setUsers,
      currentUser, setCurrentUser, loginUser,
      reviews, addReview, deleteReview,
      toasts, addToast, removeToast,
      updateUserPassword,
      wishlist, addToWishlist, removeFromWishlist,
      theme, toggleTheme,
      loading, API_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};
