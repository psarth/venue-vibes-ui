const express = require('express');
const User = require('../models/User.cjs');
const Venue = require('../models/Venue.cjs');
const Booking = require('../models/Booking.cjs');
const PlatformSettings = require('../models/PlatformSettings.cjs');
const router = express.Router();

// Admin Overview
router.get('/overview', async (req, res) => {
  try {
    const totalOwners = await User.countDocuments({ role: 'OWNER' });
    const totalVenues = await Venue.countDocuments();
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'Cancelled' } });
    
    const revenueData = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalCommission: { $sum: { $multiply: ['$amount', 0.10] } },
          totalConvenienceFee: { $sum: { $multiply: ['$amount', 0.02] } }
        }
      }
    ]);

    const stats = revenueData[0] || { totalRevenue: 0, totalCommission: 0, totalConvenienceFee: 0 };

    res.json({
      totalOwners,
      totalVenues,
      totalBookings,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Owners Management
router.get('/owners', async (req, res) => {
  try {
    const owners = await User.find({ role: 'OWNER' })
      .select('-password')
      .populate({
        path: 'venues',
        model: 'Venue',
        match: { ownerId: { $exists: true } }
      });

    const ownersWithStats = await Promise.all(
      owners.map(async (owner) => {
        const venueCount = await Venue.countDocuments({ ownerId: owner._id });
        const bookingCount = await Booking.countDocuments({
          venueId: { $in: await Venue.find({ ownerId: owner._id }).distinct('_id') }
        });

        return {
          ...owner.toObject(),
          venueCount,
          bookingCount
        };
      })
    );

    res.json(ownersWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Unblock Owner
router.patch('/owners/:id/toggle', async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    if (!owner || owner.role !== 'OWNER') {
      return res.status(404).json({ error: 'Owner not found' });
    }

    owner.isActive = !owner.isActive;
    await owner.save();

    res.json(owner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// All Venues Management
router.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject Venue
router.patch('/venues/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isActive: status === 'approved' },
      { new: true }
    ).populate('ownerId', 'name email');

    res.json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// All Bookings
router.get('/bookings', async (req, res) => {
  try {
    const { date, venueId, ownerId } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (venueId) query.venueId = venueId;
    
    if (ownerId) {
      const ownerVenues = await Venue.find({ ownerId }).distinct('_id');
      query.venueId = { $in: ownerVenues };
    }

    const bookings = await Booking.find(query)
      .populate('venueId', 'name')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Platform Settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
