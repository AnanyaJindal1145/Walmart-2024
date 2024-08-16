const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Define schema for access points
const AccessPointSchema = new mongoose.Schema({
  ssid: String,
  macAddress: String,
  x: Number,
  y: Number,
});

const AccessPoint = mongoose.model('AccessPoint', AccessPointSchema);

// Endpoint to get access points
app.get('/access-points', async (req, res) => {
  try {
    const accessPoints = await AccessPoint.find();
    res.json(accessPoints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving access points' });
  }
});

// Endpoint to estimate position based on Wi-Fi data
app.post('/position', async (req, res) => {
  const { ssid, rssi } = req.body;

  // Implement trilateration or any other algorithm to estimate the position based on the Wi-Fi signal data
  const position = { x: 150, y: 200 }; // Replace with actual calculation

  res.json(position);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});