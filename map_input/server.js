const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/indoor-positioning', { useNewUrlParser: true, useUnifiedTopology: true });

const ShelfSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    width: Number,
    height: Number
});

const Shelf = mongoose.model('Shelf', ShelfSchema);

app.post('/save-shelves', async (req, res) => {
    await Shelf.deleteMany({});
    await Shelf.insertMany(req.body.shelves);
    res.json({ message: 'Shelves saved successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
