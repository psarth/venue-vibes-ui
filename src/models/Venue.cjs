const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sportType: {
    type: String,
    required: true,
    enum: ['Cricket', 'Badminton', 'Pool', 'Snooker', 'Football', 'Tennis', 'Basketball']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  pricePerSlot: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);
