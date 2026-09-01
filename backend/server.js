const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Models
const Product = require('./models/Product');
const Review = require('./models/Review');
const User = require('./models/User');
const Order = require('./models/Order');
const SiteSetting = require('./models/SiteSetting');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message));

// --- API Routes ---

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    // Sort by newest first
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    // Update password by email
    const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Site Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = new SiteSetting(req.body);
    else settings.logoUrl = req.body.logoUrl || settings.logoUrl;
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
