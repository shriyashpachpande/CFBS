const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Student booking route
router.post('/', async (req, res) => {
  const { studentId, studentName, sport, date, startTime, endTime } = req.body;

  if (!studentId || !studentName || !sport || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const conflict = await Booking.findOne({
      sport,
      date,
      status: 'approved',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(409).json({ message: "Time slot already booked." });
    }

    const booking = new Booking({ studentId, studentName, sport, date, startTime, endTime, status: 'pending' });
    await booking.save();
    res.json({ message: "Booking successful. Awaiting admin approval." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
