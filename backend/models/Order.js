const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  total: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  name: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  userEmail: { type: String, required: true },
  deliveryLink: { type: String }, // For custom video edits delivered by Admin
  items: [{
    id: { type: String },
    title: { type: String },
    price: { type: String },
    driveLink: { type: String }
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
