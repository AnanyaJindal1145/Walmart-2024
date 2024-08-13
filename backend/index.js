const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/storemap', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const MapSchema = new mongoose.Schema({
    name: String,
    elements: [{ type: Object }], // to store map elements like squares and circles
});

const Map = mongoose.model('Map', MapSchema);

// API to create or update map
app.post('/api/maps', async (req, res) => {
    const { id, name, elements } = req.body;
    try {
        if (id) {
            await Map.findByIdAndUpdate(id, { name, elements });
            res.send({ success: true });
        } else {
            const newMap = new Map({ name, elements });
            await newMap.save();
            res.send({ id: newMap._id });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error saving map' });
    }
});

// API to get map data
app.get('/api/maps/:id', async (req, res) => {
    try {
        const map = await Map.findById(req.params.id);
        res.send(map);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving map' });
    }
});

app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
