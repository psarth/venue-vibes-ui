const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['ADMIN', 'OWNER', 'CUSTOMER'],
    required: true
  },
  phone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  // Owner-specific fields
  bankAccount: String,
  ifscCode: String,
  upiId: String,
  payoutSettings: {
    allowInstantBooking: { type: Boolean, default: true },
    allowCancellation: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);