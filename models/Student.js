const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  password: String,
  studentId: { type: String, unique: true },
  dob: String,
  mobileNumber: { type: String, unique: true }
});

module.exports = mongoose.model('Student', studentSchema);
