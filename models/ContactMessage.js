const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    date: { type: Date, default: Date.now } // date isliye dali hai ki oo pata chal ske ki user ne kab form submit kya hai 
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
