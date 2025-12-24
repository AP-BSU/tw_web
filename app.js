// server config
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// debugging
console.log('--- SERVER FILE CHECK ---');
console.log('Current Folder:', __dirname);
try {
    const rootFiles = fs.readdirSync(__dirname);
    console.log('Files in Root:', rootFiles);
    
    if (rootFiles.includes('assets')) {
        console.log('Assets folder found!');
        const assetFiles = fs.readdirSync(path.join(__dirname, 'assets'));
        console.log('Inside Assets:', assetFiles);
    } else {
        console.log('Assets folder is MISSING from Root!');
    }
} catch (error) {
    console.log('Debug Error:', error);
}
console.log('---------------------------');

app.use(express.json());
app.use(cors());



//404 conditions for missing Assets & connections
app.use('/assets/*', (req, res) => {
    console.error(`"${req.originalUrl}" not found.`);
    res.status(404).send('Asset not found');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB active'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Static paths 
app.use(express.static(path.join(__dirname))); 
app.use('assets', express.static(path.join(__dirname, 'assets')));

// Checks Statboard status
app.use('/statboard', express.static(path.join(__dirname, 'statboard')));

// ROUTES

// Dashboard Shortcut
app.get('/statboard', (req, res) => {
    // Redirects to the actual file location
    res.redirect('statboard/statboard.html');
});

// Default route (Homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Server self API initiation
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

