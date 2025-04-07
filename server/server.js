require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // 👈 1. Add axios for pinging

// const cloudinary = require('cloudinary').v2;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connections ---

// Connection to the "main" database (your existing one)
mongoose.connect(process.env.MONGODB_URI, {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to Main MongoDB'))
  .catch(err => console.error('Main MongoDB connection error:', err));

// Connection to the "secondary" database
const secondaryDbConnection = mongoose.createConnection(process.env.SECONDARY_MONGODB_URI, {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

secondaryDbConnection.on('error', (err) => {
  console.error('Secondary MongoDB connection error:', err);
});
secondaryDbConnection.once('open', () => {
  console.log('Connected to Secondary MongoDB');
});

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/mobile', require('./routes/mobile')(secondaryDbConnection));

// 👇 2. Add keep-alive endpoint
app.get('/keep-alive', (req, res) => {
  res.status(200).send('Server is awake! 👋');
});

// 👇 3. Keep-alive function to ping the app
async function pingServer() {
  try {
    const url = process.env.APP_URL + '/keep-alive'; // Set APP_URL in Render
    await axios.get(url);
    console.log('✅ Keep-alive ping successful');
  } catch (error) {
    console.error('❌ Keep-alive ping failed:', error.message);
  }
}

// Start the server and keep-alive pings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // 👇 4. Start pinging after server starts
  const intervalMinutes = 14; // Render sleeps after 15 minutes of inactivity
  const intervalMs = intervalMinutes * 60 * 1000;

  pingServer(); // Initial ping
  setInterval(pingServer, intervalMs); // Repeat
});