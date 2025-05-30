const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Admin login logic
      if (username === "sport" && password === "teacher") {
        req.session.user = { role: "admin" };
        return res.status(200).json({ success: true, redirect: "admin.html" });
      }
  
      // Student login logic
      const user = await Student.findOne({ username, password });
      if (user) {
        req.session.user = user;
        return res.status(200).json({ success: true, redirect: "home.html" });
      } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });



  
// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, password, studentId, dob, mobileNumber } = req.body;
  try {
    const existing = await Student.findOne({ $or: [{ username }, { studentId }, { mobileNumber }] });
    if (existing) {
      let conflict = existing.username === username ? 'Username' :
        existing.studentId === studentId ? 'Student ID' : 'Mobile Number';
      return res.status(409).json({ success: false, message: `${conflict} already exists.` });
    }

    const student = new Student({ firstName, lastName, username, password, studentId, dob, mobileNumber });
    await student.save();
    res.status(201).json({ success: true, message: 'Student registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
