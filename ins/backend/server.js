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

const AccessPointSchema = new mongoose.Schema({
  ssid: String,
  macAddress: String,
  x: Number,
  y: Number,
});

const AccessPoint = mongoose.model('AccessPoint', AccessPointSchema);

// Endpoint to estimate position based on Wi-Fi data
app.post('/position', async (req, res) => {
  const wifiData = req.body; // [{ ssid: 'AP1', rssi: -50 }, ...]

  try {
    const accessPoints = await AccessPoint.find({
      ssid: { $in: wifiData.map(ap => ap.ssid) }
    });

    if (accessPoints.length < 3) {
      return res.status(400).json({ message: 'Not enough access points for trilateration' });
    }

    // Calculate distances based on RSSI
    const distances = wifiData.map(data => {
      const ap = accessPoints.find(ap => ap.ssid === data.ssid);
      const distance = calculateDistanceFromRSSI(data.rssi);
      return { ...ap._doc, distance };
    });

    // Trilateration algorithm
    const position = performTrilateration(distances);
    res.json(position);

  } catch (error) {
    res.status(500).json({ message: 'Error calculating position', error });
  }
});

// Calculate distance from RSSI
function calculateDistanceFromRSSI(rssi) {
  const RSSI_ref = -30; // RSSI at 1 meter distance
  const n = 2.0; // Path loss exponent, depends on the environment
  return Math.pow(10, (RSSI_ref - rssi) / (10 * n));
}

// Trilateration algorithm
function performTrilateration(distances) {
  const { x: x1, y: y1, distance: r1 } = distances[0];
  const { x: x2, y: y2, distance: r2 } = distances[1];
  const { x: x3, y: y3, distance: r3 } = distances[2];

  const A = 2*x2 - 2*x1;
  const B = 2*y2 - 2*y1;
  const C = r1*r1 - r2*r2 - x1*x1 - y1*y1 + x2*x2 + y2*y2;
  const D = 2*x3 - 2*x2;
  const E = 2*y3 - 2*y2;
  const F = r2*r2 - r3*r3 - x2*x2 - y2*y2 + x3*x3 + y3*y3;

  const x = (C*E - F*B) / (E*A - B*D);
  const y = (C*D - A*F) / (B*D - A*E);

  return { x, y };
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});