const express = require('express');
const Booking = require('../models/Booking.cjs');
const Venue = require('../models/Venue.cjs');
const router = express.Router();

// Get revenue analytics
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user.id });
    const venueIds = venues.map(v => v._id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    
    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - 1);
    
    // Today's revenue
    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          venueId: { $in: venueIds },
          date: { $gte: today },
          status: { $ne: 'Cancelled' }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Weekly revenue
    const weeklyRevenue = await Booking.aggregate([
      {
        $match: {
          venueId: { $in: venueIds },
          date: { $gte: weekStart },
          status: { $ne: 'Cancelled' }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          venueId: { $in: venueIds },
          date: { $gte: monthStart },
          status: { $ne: 'Cancelled' }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Total bookings
    const totalBookings = await Booking.countDocuments({
      venueId: { $in: venueIds },
      status: { $ne: 'Cancelled' }
    });
    
    // Daily revenue chart (last 7 days)
    const dailyRevenue = await Booking.aggregate([
      {
        $match: {
          venueId: { $in: venueIds },
          date: { $gte: weekStart },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          revenue: { $sum: '$amount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      todayRevenue: todayRevenue[0]?.total || 0,
      weeklyRevenue: weeklyRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalBookings,
      dailyRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
