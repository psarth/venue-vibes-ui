const express = require('express');
const Venue = require('../models/Venue.cjs');
const Booking = require('../models/Booking.cjs');
const PlatformSettings = require('../models/PlatformSettings.cjs');
const router = express.Router();

// Owner Overview
router.get('/overview', async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user.id });
    const venueIds = venues.map(v => v._id);
    
    const bookings = await Booking.find({
      venueId: { $in: venueIds },
      status: { $ne: 'Cancelled' }
    });

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    
    const settings = await PlatformSettings.findOne() || { commissionPercentage: 10, convenienceFeePercentage: 2 };
    const platformFee = totalRevenue * (settings.commissionPercentage / 100);
    const convenienceFee = totalRevenue * (settings.convenienceFeePercentage / 100);
    const netRevenue = totalRevenue - platformFee - convenienceFee;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = bookings.filter(b => new Date(b.date) >= today);
    const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.amount, 0);

    res.json({
      totalRevenue,
      platformFee,
      convenienceFee,
      netRevenue,
      todayRevenue,
      totalBookings: bookings.length,
      todayBookings: todayBookings.length,
      totalVenues: venues.length,
      activeVenues: venues.filter(v => v.isActive).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Owner Venues
router.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user.id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/venues', async (req, res) => {
  try {
    const venue = new Venue({
      ...req.body,
      ownerId: req.user.id
    });
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/venues/:id', async (req, res) => {
  try {
    const venue = await Venue.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/venues/:id/toggle', async (req, res) => {
  try {
    const venue = await Venue.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    venue.isActive = !venue.isActive;
    await venue.save();
    res.json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Owner Bookings
router.get('/bookings', async (req, res) => {
  try {
    const { date, venueId } = req.query;
    
    const venues = await Venue.find({ ownerId: req.user.id });
    const venueIds = venues.map(v => v._id);
    
    let query = { venueId: { $in: venueIds } };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (venueId) {
      query.venueId = venueId;
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

// Payout History (mock)
router.get('/payouts', async (req, res) => {
  try {
    // Mock payout data - replace with real payout logic
    const payouts = [
      {
        id: 'PAY001',
        amount: 8800,
        date: '2024-01-15',
        status: 'Completed',
        method: 'Bank Transfer'
      },
      {
        id: 'PAY002',
        amount: 12400,
        date: '2024-01-08',
        status: 'Completed',
        method: 'UPI'
      }
    ];
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
