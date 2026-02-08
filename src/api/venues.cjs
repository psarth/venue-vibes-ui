const express = require('express');
const Venue = require('../models/Venue.cjs');
const router = express.Router();

// Get all venues for owner
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user.id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new venue
router.post('/', async (req, res) => {
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

// Update venue
router.put('/:id', async (req, res) => {
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

// Toggle venue status
router.patch('/:id/toggle', async (req, res) => {
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

module.exports = router;
