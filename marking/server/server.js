// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3001;

// // MongoDB connection setup
// mongoose.connect('mongodb://127.0.0.1:27017/store', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error('Error connecting to MongoDB', err);
// });

// // Define a schema and model for item coordinates
// const itemSchema = new mongoose.Schema({
//   itemId: String,
//   boxNumber: Number,
// });

// const Item = mongoose.model('Item', itemSchema);

// app.use(cors());
// app.use(express.json());

// // Endpoint to get item coordinates from MongoDB
// app.get('/items', async (req, res) => {
//   try {
//     const items = await Item.find(); // Fetch all items from the database
//     const itemBoxes = items.reduce((acc, item) => {
//       acc[item.itemId] = item.boxNumber;
//       return acc;
//     }, {});
//     res.json(itemBoxes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving items from database' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



// /*
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3001;

// app.use(cors());
// app.use(express.json());

// // Sample item coordinates
// const itemCoordinates = {
//   item1: { x: 100, y: 100 },
//   item2: { x: 200, y: 150 },
//   item3: { x: 450, y: 100 },
//   item4: { x: 550, y: 350 }
// };

// // Endpoint to get item coordinates
// app.get('/items', (req, res) => {
//   res.json(itemCoordinates);
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
// */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// MongoDB connection setup
mongoose.connect('mongodb+srv://ajindal1145:ZWwhfn7JcoQUt2cS@ins.ccuyb.mongodb.net/floorplan?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

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
app.use(express.json());

// Endpoint to get item coordinates and dimensions from MongoDB
app.get('/items', async (req, res) => {
  try {
    const map = await Map.findOne({ name: 'MyFloorMap' }); // Replace 'MyFloorMap' with the actual map name

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
