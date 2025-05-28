// server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 1432;
// Static files serve karo
app.use(express.static(path.join(__dirname, 'public_folder')));

// Server chalu karo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_folder', 'home.html'));
  });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
