// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    studentId: String,
    studentName: String,
    sport: String,
    date: String,
    startTime: String,
    endTime: String,
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);
