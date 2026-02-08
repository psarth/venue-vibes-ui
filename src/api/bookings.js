const express = require('express');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const router = express.Router();

// Get all bookings for owner venues
router.get('/', async (req, res) => {
  try {
    const { date, venueId } = req.query;
    
    // Get owner's venues
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
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('venueId');
    
    if (!booking || booking.venueId.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;