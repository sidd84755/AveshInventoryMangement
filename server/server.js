require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connections ---

// Connection to the "main" database (your existing one)
mongoose.connect(process.env.MONGODB_URI, {  // Use the existing mongoose.connect
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to Main MongoDB'))
  .catch(err => console.error('Main MongoDB connection error:', err));


// Connection to the "secondary" database
const secondaryDbConnection = mongoose.createConnection(process.env.SECONDARY_MONGODB_URI, {  // Use createConnection
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

secondaryDbConnection.on('error', (err) => {
  console.error('Secondary MongoDB connection error:', err);
});
secondaryDbConnection.once('open', () => {
  console.log('Connected to Secondary MongoDB');
});
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes (Keep the existing routes and add the new one)
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

// New route for the secondary database (e.g., for "users")
app.use('/api/mobile', require('./routes/mobile')(secondaryDbConnection)); // Pass the connection

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));