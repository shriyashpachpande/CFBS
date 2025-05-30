const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const newMessage = new ContactMessage({
            name,
            email,
            phone,
            message

        });

        await newMessage.save();

        res.send(`<script>alert("Message sent successfully!"); window.location.href = "/contact.html";</script>`);
    } catch (error) {
        console.error("❌ Error saving contact message:", error);
        res.status(500).send("Something went wrong. Please try again later.");
    }
});

module.exports = router;
