


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Booking = require('./models/Booking');


const app = express();
const PORT = 1432;

// 🔌 Connect to MongoDB

mongoose.connect('mongodb://127.0.0.1:27017/facility-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});


// Middleware
app.use(express.json());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public_folder')));

// Routes
const bookRoute = require('./routes/book');
app.use('/book', bookRoute);
app.post('/book', async (req, res) => {
  try {
    const { studentId, studentName, sport, date, startTime, endTime } = req.body;

    // validate inputs
    if (!studentId || !studentName || !sport || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // check for conflict
    const existing = await Booking.findOne({
      sport,
      date,
      status: 'approved',
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });


    if (existing) {
      return res.status(409).json({ message: "Time slot already booked. Please choose another time." });
    }

    const booking = new Booking({
      studentId,
      studentName,
      sport,
      date,
      startTime,
      endTime,
      status: 'pending'
    });

    await booking.save();
    res.json({ message: "Booking successful. Awaiting admin approval." });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error." });
  }
});





// Require Booking model at top

// Route to get all bookings (could add filters later)
// Show all bookings (for admin panel)
app.get('/admin/bookings', async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
  res.json(bookings);
});

// Approve a booking
// Approve a booking and auto-reject conflicts
app.post('/admin/approve/:id', async (req, res) => {
  try {
    const approvedBooking = await Booking.findById(req.params.id);
    if (!approvedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Step 1: Approve the selected booking
    approvedBooking.status = 'approved';
    await approvedBooking.save();

    // Step 2: Reject all pending conflicting bookings
    await Booking.updateMany({
      _id: { $ne: approvedBooking._id }, // exclude this one
      sport: approvedBooking.sport,
      date: approvedBooking.date,
      status: 'pending',
      startTime: { $lt: approvedBooking.endTime },
      endTime: { $gt: approvedBooking.startTime }
    }, {
      $set: { status: 'rejected' }
    });

    res.json({ message: 'Booking approved. Conflicting pending bookings auto-rejected.' });

  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ message: 'Server error during approval' });
  }
});


// Reject a booking
app.post('/admin/reject/:id', async (req, res) => {
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






// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_folder', 'home.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
