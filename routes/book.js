const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 🔄 Convert time string to minutes
const timeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

router.post('/', async (req, res) => {
    const { studentId, studentName, sport, date, startTime, endTime } = req.body;

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // 🧠 Check overlapping bookings
    // 🧠 Check overlapping bookings (only for pending or approved)
    const existingBookings = await Booking.find({
        sport,
        date,
        status: 'approved'
        
    });

    const isConflict = existingBookings.some(b => {
        const existStart = timeToMinutes(b.startTime);
        const existEnd = timeToMinutes(b.endTime);
        return newStart < existEnd && newEnd > existStart;
    });


    if (isConflict) {
        return res.status(409).json({ message: "Time slot already booked. Please choose another." });
    }

    // ✅ Save new booking
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
    res.status(200).json({ message: "Booking submitted. Awaiting admin approval." });
});

module.exports = router;
