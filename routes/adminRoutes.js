const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
  res.json(bookings);
});

// Approve booking & reject conflicts
router.post('/approve/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.status = 'approved';
    await booking.save();

    await Booking.updateMany({
      _id: { $ne: booking._id },
      sport: booking.sport,
      date: booking.date,
      status: 'pending',
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime }
    }, { $set: { status: 'rejected' } });

    res.json({ message: "Approved and conflicts rejected." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject booking
router.post('/reject/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.status = 'rejected';
    await booking.save();
    res.json({ message: 'Booking rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
