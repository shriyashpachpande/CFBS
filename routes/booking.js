const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /book
router.post('/book', async (req, res) => {
    const { studentId, studentName, sport, date, startTime, endTime } = req.body;

    // 🧠 Check for overlapping bookings
    const conflict = await Booking.findOne({
        sport,
        date,
        status: 'approved',
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });


    if (conflict) {
        return res.status(409).json({ message: "This time slot is already booked. Please choose another." });
    }

    // ✅ Save new booking with 'pending' status
    const newBooking = new Booking({
        studentId,
        studentName,
        sport,
        date,
        startTime,
        endTime,
        status: 'pending'
    });

    await newBooking.save();
    res.json({ message: "Booking submitted successfully. Awaiting admin approval." });
});


module.exports = router;
