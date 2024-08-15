const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const ShelfSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    number: String,
    itemName: String
});

const MapSchema = new mongoose.Schema({
    name: String,
    svgContent: String,
    shelves: [ShelfSchema]
});

const Map = mongoose.model('Map', MapSchema);

app.post('/save-shelves', async (req, res) => {
    console.log('Received data:', req.body); // Log received data
    const { mapName, svgContent, shelves } = req.body;

    if (!mapName || !svgContent || !Array.isArray(shelves)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const map = await Map.findOneAndUpdate(
            { name: mapName },
            { svgContent, shelves },
            { upsert: true, new: true }
        );
        res.json({ message: 'Map and shelves saved successfully', map });
    } catch (error) {
        console.error('Error saving data:', error); // Log any errors
        res.status(500).json({ message: 'Error saving data', error });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

