const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  logoUrl: { type: String, default: '/ds3_logo.jpg' }
}, { timestamps: true });

siteSettingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
