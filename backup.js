const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require("./models/User");
const Booking = require('./models/Booking');
const Student = require('./models/Student'); // 👈 Add this!



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



const session = require('express-session');

app.use(session({
  secret: 'mySecretKey', // 🔐 Change this to a strong secret
  resave: false,
  saveUninitialized: true
}));

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html'); // 👈 redirect to login if not logged in
  }
  next(); // ✅ Allow access if logged in
}
const publicPages = ['/login.html', '/registration.html', '/about.html'];

app.use((req, res, next) => {
  if (req.path.endsWith('.html') && !publicPages.includes(req.path)) {
    if (!req.session.user) {
      return res.redirect('/login.html');
    }
  }
  next();
});


// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Student.findOne({ username, password });
    if (user) {
      req.session.user = user; // ✅ Save user in session
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

////////////////////////register//////////////////
app.post('/register', async (req, res) => {
  const { firstName, lastName, username, password, studentId, dob, mobileNumber } = req.body;

  try {
    const existingStudent = await Student.findOne({
      $or: [
        { username },
        { studentId },
        { mobileNumber }
      ]
    });

    if (existingStudent) {
      let conflictField = '';
      if (existingStudent.username === username) conflictField = 'Username';
      else if (existingStudent.studentId === studentId) conflictField = 'Student ID';
      else if (existingStudent.mobileNumber === mobileNumber) conflictField = 'Mobile Number';

      return res.status(409).json({ success: false, message: `${conflictField} already exists.` });
    }

    const student = new Student({ firstName, lastName, username, password, studentId, dob, mobileNumber });
    await student.save();

    res.status(201).json({ success: true, message: 'Student registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

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
  res.sendFile(path.join(__dirname, 'public_folder', 'login.html'));
});
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.redirect('/login.html');
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


