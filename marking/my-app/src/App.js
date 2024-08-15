import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    // Fetch item data from the server
    axios.get('http://localhost:3001/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const getMarkerPosition = () => {
    const item = items[selectedItem];
    return item ? {
      top: `${item.y}px`,
      left: `${item.x}px`,
      width: `${item.width}px`,
      height: `${item.height}px`,
    } : { top: '0px', left: '0px', width: '0px', height: '0px' };
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Virtual Store Map</h1>
        <select onChange={handleChange} value={selectedItem}>
          <option value="">Select an item</option>
          {Object.keys(items).map(itemId => (
            <option key={itemId} value={itemId}>
              {itemId}
            </option>
          ))}
        </select>
      </header>
      <div className="store-map">
        {Object.entries(items).map(([itemId, item]) => (
          <div
            key={itemId}
            className="box"
            style={{
              top: `${item.y}px`,
              left: `${item.x}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
            }}
          >
            <div className="box-number">{item.number}</div>
          </div>
        ))}
        {selectedItem && (
          <div
            className="marker"
            style={getMarkerPosition()}
          >
            <div className="marker-text">Selected Item</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemCoordinates, setItemCoordinates] = useState({});
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    async function fetchItemCoordinates() {
      try {
        const response = await axios.get('http://localhost:3001/items');
        setItemCoordinates(response.data);
      } catch (error) {
        console.error('Error fetching item coordinates:', error);
      }
    }

    fetchItemCoordinates();
  }, []);

  function handleItemChange(event) {
    setSelectedItem(event.target.value);
  }

  function getItemStyle(itemId) {
    if (!selectedItem) {
      return { display: 'none' }; // Hide all items if none is selected
    }
    return itemId === selectedItem ? { display: 'block' } : { display: 'none' };
  }

  return (
    <div className="App">
      <select onChange={handleItemChange} value={selectedItem}>
        <option value="">Select an item</option>
        {Object.keys(itemCoordinates).map(itemId => (
          <option key={itemId} value={itemId}>
            {`Item ${itemId.slice(-1)}`}
          </option>
        ))}
      </select>

      <svg id="storeMap" width="800" height="600">
        
        <rect x="50" y="50" width="300" height="200" fill="#e0e0e0" stroke="#000" strokeWidth="2"/>
        <rect x="50" y="300" width="300" height="200" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
        <rect x="400" y="50" width="300" height="200" fill="#d0d0d0" stroke="#000" strokeWidth="2"/>
        <rect x="400" y="300" width="300" height="200" fill="#b0b0b0" stroke="#000" strokeWidth="2"/>

        {Object.keys(itemCoordinates).map(itemId => {
          const { x, y } = itemCoordinates[itemId];
          return (
            <circle
              key={itemId}
              cx={x}
              cy={y}
              r="10"
              fill="red"
              style={getItemStyle(itemId)}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default App;
*/