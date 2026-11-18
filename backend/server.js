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

// Helper to recover and save an order directly from a captured Razorpay payment
async function recoverOrderFromRazorpayPayment(payment) {
  if (!payment || payment.status !== 'captured') return null;

  // Check if order already exists by transactionId
  const existing = await Order.findOne({ transactionId: payment.id });
  if (existing) return existing;

  const allProducts = await Product.find();
  let matchedItems = [];

  const rawItemTitle = payment.notes?.items || '';
  if (rawItemTitle) {
    const titles = rawItemTitle.split(',').map(s => s.trim());
    titles.forEach(t => {
      const prod = allProducts.find(p => p.title.toLowerCase() === t.toLowerCase());
      if (prod) {
        matchedItems.push({
          id: String(prod._id || prod.id),
          title: prod.title,
          price: prod.price || `₹${(payment.amount / 100).toFixed(2)}`,
          driveLink: prod.driveLink || ''
        });
      } else {
        matchedItems.push({
          id: 'item-' + Date.now(),
          title: t,
          price: `₹${(payment.amount / 100).toFixed(2)}`,
          driveLink: allProducts[0]?.driveLink || 'https://drive.google.com'
        });
      }
    });
  }

  if (matchedItems.length === 0) {
    const amountInRupees = payment.amount / 100;
    const prodByPrice = allProducts.find(p => {
      const num = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
      return Math.abs(num - amountInRupees) < 0.05;
    });
    if (prodByPrice) {
      matchedItems.push({
        id: String(prodByPrice._id || prodByPrice.id),
        title: prodByPrice.title,
        price: prodByPrice.price,
        driveLink: prodByPrice.driveLink || ''
      });
    } else if (allProducts.length > 0) {
      matchedItems.push({
        id: String(allProducts[0]._id || allProducts[0].id),
        title: allProducts[0].title,
        price: `₹${amountInRupees.toFixed(2)}`,
        driveLink: allProducts[0].driveLink || ''
      });
    }
  }

  const newOrderId = await generateServerOrderId();
  const customerEmail = payment.notes?.customerEmail || payment.email || 'customer@ds3studio.com';
  const customerName = customerEmail.split('@')[0] || 'Valued Customer';
  const deliveryLink = matchedItems[0]?.driveLink || allProducts[0]?.driveLink || 'https://drive.google.com';

  const newOrder = new Order({
    id: newOrderId,
    date: payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
    total: `₹${(payment.amount / 100).toFixed(2)}`,
    status: 'Approved',
    name: customerName,
    paymentMethod: payment.method ? `Razorpay (${payment.method.toUpperCase()})` : 'Razorpay',
    transactionId: payment.id,
    userEmail: customerEmail,
    deliveryLink: deliveryLink,
    razorpayOrderId: payment.order_id || '',
    razorpayPaymentId: payment.id,
    items: matchedItems
  });

  return await newOrder.save();
}

// Sync / Recover single payment by ID (used by frontend delivery lookup & order restore)
app.get('/api/payment/sync-payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) return res.status(400).json({ error: 'Payment ID is required' });

    // 1. Check if already in DB
    const existing = await Order.findOne({
      $or: [{ transactionId: paymentId }, { razorpayPaymentId: paymentId }, { id: paymentId }]
    });
    if (existing) {
      return res.json({ success: true, order: existing, recovered: false });
    }

    // 2. Fetch from Razorpay API
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment || payment.status !== 'captured') {
      return res.status(404).json({ success: false, error: 'Payment not found or not captured yet in Razorpay' });
    }

    // 3. Recover and save order
    const recovered = await recoverOrderFromRazorpayPayment(payment);
    return res.json({ success: true, order: recovered, recovered: true });
  } catch (err) {
    console.error('Error syncing payment:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to sync payment' });
  }
});

// Admin Sync: Fetch recent payments from Razorpay and recover any missing orders
app.post('/api/payment/sync-all', async (req, res) => {
  try {
    const list = await razorpay.payments.all({ count: 50 });
    const recoveredOrders = [];

    for (const payment of (list.items || [])) {
      if (payment.status === 'captured') {
        const existing = await Order.findOne({ transactionId: payment.id });
        if (!existing) {
          const recovered = await recoverOrderFromRazorpayPayment(payment);
          if (recovered) recoveredOrders.push(recovered);
        }
      }
    }

    res.json({
      success: true,
      recoveredCount: recoveredOrders.length,
      orders: recoveredOrders
    });
  } catch (err) {
    console.error('Error syncing all payments:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Razorpay Webhook listener (catches payment.captured & order.paid directly from Razorpay server)
app.post('/api/payment/webhook', async (req, res) => {
  try {
    const event = req.body.event;
    if (event === 'payment.captured' && req.body.payload?.payment?.entity) {
      await recoverOrderFromRazorpayPayment(req.body.payload.payment.entity);
    }
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).json({ status: 'ok', warning: err.message });
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
