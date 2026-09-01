const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  status: { type: String, default: 'Completed' },
  items: [{
    title: { type: String },
    price: { type: String }
  }]
}, { timestamps: true });

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Order', orderSchema);
