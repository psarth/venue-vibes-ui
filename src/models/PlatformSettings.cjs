const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  commissionPercentage: {
    type: Number,
    default: 10,
    min: 0,
    max: 50
  },
  convenienceFeePercentage: {
    type: Number,
    default: 2,
    min: 0,
    max: 10
  },
  refundPolicy: {
    allowRefund: { type: Boolean, default: true },
    refundDeadlineHours: { type: Number, default: 24 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
