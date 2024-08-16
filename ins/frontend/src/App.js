import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [accessPoints, setAccessPoints] = useState([]);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Fetch access points from the backend
    axios.get('http://localhost:3001/access-points')
      .then(response => {
        setAccessPoints(response.data);
      })
      .catch(error => {
        console.error('Error fetching access points:', error);
      });
  }, []);

  const estimatePosition = () => {
    // Simulated Wi-Fi data (replace with actual data)
    const wifiData = [
      { ssid: 'AP1', rssi: -50 },
      { ssid: 'AP2', rssi: -60 },
      { ssid: 'AP3', rssi: -70 },
    ];

    axios.post('http://localhost:3001/position', wifiData)
      .then(response => {
        setUserPosition(response.data);
      })
      .catch(error => {
        console.error('Error estimating position:', error);
      });
  };

  useEffect(() => {
    estimatePosition();
  }, []);

  return (
    <div className="App">
      <h1>Indoor Navigation System</h1>
      <svg width="800" height="600" className="store-map">
        {/* Display Wi-Fi access points */}
        {accessPoints.map(ap => (
          <g key={ap.ssid}>
            <circle cx={ap.x} cy={ap.y} r="5" fill="blue" />
            <text x={ap.x + 10} y={ap.y} fill="black">{ap.ssid}</text>
          </g>
        ))}

        {/* Display the user's estimated position */}
        {userPosition && (
          <circle cx={userPosition.x} cy={userPosition.y} r="10" fill="red" />
        )}
      </svg>
    </div>
  );
}

export default App;
