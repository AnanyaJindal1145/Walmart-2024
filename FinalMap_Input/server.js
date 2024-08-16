const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 8000;

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the schema and model for items
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

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save shelves
app.post('/save-shelves', async (req, res) => {
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
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Endpoint to get item coordinates and dimensions from MongoDB
app.get('/items', async (req, res) => {
    try {
        const map = await Map.findOne({ name: 'MyFloorMap' });

        if (!map) {
            return res.status(404).json({ message: 'Map not found' });
        }

        // Extract item details from the shelves
        const itemDetails = map.shelves.reduce((acc, shelf) => {
            acc[shelf.itemName] = {
                x: shelf.x,
                y: shelf.y,
                width: shelf.width,
                height: shelf.height,
                number: shelf.number
            };
            return acc;
        }, {});

        res.json(itemDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items from database', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
