const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

// Override default DNS to avoid 'querySrv ECONNREFUSED' issues
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Models
const Product = require('./models/Product');
const Review = require('./models/Review');
const User = require('./models/User');
const Order = require('./models/Order');
const SiteSetting = require('./models/SiteSetting');

const app = express();
const PORT = process.env.PORT || 5000;

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_TWTH9nOKea11hk',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'wqH8f7Z0JUqYvO1SLKtREBCS'
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    // Update password by email
    const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Helper to generate continuous sequential Order ID: DDMMYYYY-001, DDMMYYYY-002, etc.
async function generateServerOrderId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const datePrefix = `${day}${month}${year}`;

  const allOrders = await Order.find();
  let maxSeq = 0;
  allOrders.forEach(o => {
    const idStr = String(o.id || '').trim();
    const match = idStr.match(/[_-](\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSeq = maxSeq + 1;
  return `${datePrefix}-${String(nextSeq).padStart(3, '0')}`;
}

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    // If no order id provided, generate sequential continuous ID
    if (!req.body.id) {
      req.body.id = await generateServerOrderId();
    } else {
      // If order with this exact ID already exists (and not same transaction), assign next sequential ID
      const existingSameId = await Order.findOne({ id: req.body.id });
      if (existingSameId && (!req.body.transactionId || existingSameId.transactionId !== req.body.transactionId)) {
        req.body.id = await generateServerOrderId();
      }
    }

    // Check if order already exists by id or transactionId
    if (req.body.id || req.body.transactionId) {
      const existing = await Order.findOne({
        $or: [
          ...(req.body.id ? [{ id: req.body.id }] : []),
          ...(req.body.transactionId ? [{ transactionId: req.body.transactionId }] : [])
        ]
      });
      if (existing) {
        return res.status(200).json(existing);
      }
    }
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    // using id since our frontend uses string id instead of _id
    const order = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- Razorpay Payment Endpoints ---
app.get('/api/payment/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_live_TWTH9nOKea11hk' });
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Razorpay requires amount in paise (1 INR = 100 paise) as an integer
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const rzpOrder = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_live_TWTH9nOKea11hk'
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Payment ID is required' });
    }

    // If order_id and signature are provided, verify signature
    if (razorpay_order_id && razorpay_signature) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'wqH8f7Z0JUqYvO1SLKtREBCS';
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Invalid payment signature' });
      }
    }

    // Payment verified! Create order in DB with status 'Approved'
    let savedOrder = null;
    if (orderData) {
      let finalOrderId = orderData.id;
      if (!finalOrderId) {
        finalOrderId = await generateServerOrderId();
      } else {
        const existingOrder = await Order.findOne({ id: finalOrderId });
        if (existingOrder && existingOrder.transactionId !== razorpay_payment_id) {
          finalOrderId = await generateServerOrderId();
        }
      }

      savedOrder = new Order({
        id: finalOrderId,
        date: new Date(),
        total: orderData.total,
        status: 'Approved',
        name: orderData.name,
        paymentMethod: 'Razorpay',
        transactionId: razorpay_payment_id,
        userEmail: orderData.userEmail,
        items: orderData.items || [],
        razorpayOrderId: razorpay_order_id || '',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature || ''
      });
      await savedOrder.save();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully. Order confirmed!',
      order: savedOrder
    });
  } catch (err) {
    console.error('Error verifying Razorpay payment:', err);
    res.status(500).json({ success: false, error: err.message || 'Payment verification failed' });
  }
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
