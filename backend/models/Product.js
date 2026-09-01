const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String, required: true },
  features: { type: [String], required: true },
  driveLink: { type: String, required: true },
}, { timestamps: true });

// Convert _id to id when sending to frontend
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Product', productSchema);
