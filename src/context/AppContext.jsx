import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://video-editing-h7vr.onrender.com/api';

const initialProducts = [
  {
    id: "prod-1",
    title: "FL Studio Master Template",
    description: "Industry-standard mixing & mastering template for FL Studio 21+.",
    price: "₹29.99",
    image: "/music_production_hero.jpg",
    color: "#ff7b00",
    features: ["Pre-routed Mixer Tracks", "Vocal Chain Presets", "Stock Plugins Only", "Bonus Sample Pack"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_1"
  },
  {
    id: "prod-2",
    title: "Logic Pro Vocal Chain",
    description: "Get pristine vocals instantly with our premium Logic Pro X channel strips.",
    price: "₹34.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#00a8ff",
    features: ["Pop & Rap Vocal Presets", "Zero Latency Recording", "Mastering Chain Included", "Easy to install"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_2"
  },
  {
    id: "prod-3",
    title: "Ableton Live Synth Presets",
    description: "100+ Serum & Vital presets tailored for Ableton Live 11+.",
    price: "₹24.99",
    image: "/music_production_hero.jpg",
    color: "#00ff88",
    features: ["100+ Premium Presets", "Macros Pre-mapped", "Ableton Racks", "Future Bass & Trap"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_3"
  },
  {
    id: "prod-4",
    title: "Cubase Orchestral Template",
    description: "Massive orchestral routing template for Cubase Pro.",
    price: "₹49.99",
    image: "/vfx_hero_bundle.jpg",
    color: "#ff0054",
    features: ["Kontakt Routing", "Expression Maps", "Color Coded Tracks", "Stem Export Ready"],
    driveLink: "https://drive.google.com/drive/folders/placeholder_4"
  },
  {
    id: "prod-5",
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
  
  const [products, setProductsState] = useState(() => {
    try {
      const saved = localStorage.getItem('ds3_products');
      const list = saved ? JSON.parse(saved) : initialProducts;
      return list.map((p, idx) => ({
        ...p,
        id: p.id || p._id || `prod-${idx + 1}`
      }));
    } catch (e) {
      return initialProducts;
    }
  });
  const [siteSettings, setSiteSettingsState] = useState(() => {
    const saved = localStorage.getItem('ds3_siteSettings');
    return saved ? JSON.parse(saved) : { logoUrl: '/ds3_logo.jpg' };
  });
  const [orders, setOrdersState] = useState(() => {
    const saved = localStorage.getItem('ds3_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [users, setUsersState] = useState(() => {
    const saved = localStorage.getItem('ds3_users');
    return saved ? JSON.parse(saved) : [{ email: 'genzdevoff@gmail.com', password: 'password123' }];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ds3_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [reviews, setReviewsState] = useState(() => {
    const saved = localStorage.getItem('ds3_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });
  const [loading, setLoading] = useState(false);
  
  // New States
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ds3_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart state persisted in localStorage across page refreshes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ds3_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse ds3_cart from localStorage:", e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ds3_theme') || 'dark';
  });

  // Helper to fetch data in background without blocking UI
  const fetchData = async () => {
    try {
      const axiosConfig = { timeout: 15000 };
      const [prodRes, revRes, userRes, ordRes, setRes] = await Promise.all([
        axios.get(`${API_URL}/products`, axiosConfig),
        axios.get(`${API_URL}/reviews`, axiosConfig),
        axios.get(`${API_URL}/users`, axiosConfig),
        axios.get(`${API_URL}/orders`, axiosConfig),
        axios.get(`${API_URL}/settings`, axiosConfig)
      ]);

      if (prodRes.data && prodRes.data.length > 0) {
        setProductsState(prodRes.data);
        localStorage.setItem('ds3_products', JSON.stringify(prodRes.data));
      }
      if (revRes.data && revRes.data.length > 0) {
        setReviewsState(revRes.data);
        localStorage.setItem('ds3_reviews', JSON.stringify(revRes.data));
      }
      if (userRes.data && userRes.data.length > 0) {
        setUsersState(userRes.data);
        localStorage.setItem('ds3_users', JSON.stringify(userRes.data));
      }
      if (ordRes.data) {
        setOrdersState(ordRes.data);
        localStorage.setItem('ds3_orders', JSON.stringify(ordRes.data));
      }
      if (setRes.data) {
        setSiteSettingsState(setRes.data);
        localStorage.setItem('ds3_siteSettings', JSON.stringify(setRes.data));
      }
    } catch (err) {
      console.warn("Backend server is warming up or slow, using instant cached assets:", err.message);
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
    try {
      localStorage.setItem('ds3_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save ds3_cart to localStorage:", e);
    }
  }, [cartItems]);

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

  const addToCart = (product) => {
    if (!product) return;
    const prodId = product.id || product._id || product.title;
    let added = false;

    setCartItems(prev => {
      const exists = prev.some(item => (item.id || item._id || item.title) === prodId);
      if (!exists) {
        added = true;
        return [...prev, product];
      }
      return prev;
    });

    if (added) {
      addToast(`${product.title} added to cart!`, 'success');
    } else {
      addToast(`${product.title} is already in your cart!`, 'info');
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item.id || item._id || item.title) !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('ds3_cart');
    } catch (e) {
      console.error("Failed to remove ds3_cart from localStorage:", e);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    if (!item || !item.price) return total;
    const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    return total + num;
  }, 0);

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
      setSiteSettingsState(newSettings); // Optimistic UI update
      const res = await axios.put(`${API_URL}/settings`, newSettings);
      setSiteSettingsState(res.data);
    } catch (err) {
      console.error(err);
      addToast("Failed to update logo", "error");
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
      cartItems, setCartItems, addToCart, removeFromCart, clearCart, cartTotal,
      isCartOpen, setIsCartOpen,
      theme, toggleTheme,
      loading, API_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};
