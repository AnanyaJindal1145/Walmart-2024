import React, { useState, useRef } from 'react';

const MapDesigner = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentRect, setCurrentRect] = useState(null);
  const [shelves, setShelves] = useState([]);
  const svgRef = useRef(null);
  const svgContainerRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContainer = svgContainerRef.current;
        svgContainer.innerHTML = e.target.result;
        const svgElement = svgContainer.querySelector('svg');
        svgRef.current = svgElement;

        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        svgElement.addEventListener('mousedown', startDrawing);
        svgElement.addEventListener('mousemove', drawRectangle);
        svgElement.addEventListener('mouseup', finishDrawing);
      };
      reader.readAsText(file);
    }
  };

  const startDrawing = (event) => {
    setIsDrawing(true);
    const point = getMousePosition(event);
    setStartX(point.x);
    setStartY(point.y);

    const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    newRect.setAttribute('x', point.x);
    newRect.setAttribute('y', point.y);
    newRect.setAttribute('width', 0);
    newRect.setAttribute('height', 0);

    // Explicit styling to ensure visibility
    newRect.setAttribute('stroke', 'red');    // Red boundary
    newRect.setAttribute('fill', 'transparent'); // Transparent fill
    newRect.setAttribute('stroke-width', 2);  // Boundary thickness

    svgRef.current.appendChild(newRect);
    setCurrentRect(newRect);
  };

  const drawRectangle = (event) => {
    if (!isDrawing || !currentRect) return;

    const point = getMousePosition(event);
    const width = point.x - startX;
    const height = point.y - startY;

    currentRect.setAttribute('width', Math.abs(width));
    currentRect.setAttribute('height', Math.abs(height));
    if (width < 0) currentRect.setAttribute('x', point.x);
    if (height < 0) currentRect.setAttribute('y', point.y);
  };

  const finishDrawing = () => {
    setIsDrawing(false);

    const number = prompt('Enter number for this rectangle:');
    const itemName = prompt('Enter item name for this rectangle:');

    const rect = {
      x: parseFloat(currentRect.getAttribute('x')),
      y: parseFloat(currentRect.getAttribute('y')),
      width: parseFloat(currentRect.getAttribute('width')),
      height: parseFloat(currentRect.getAttribute('height')),
      number,
      itemName,
    };

    setShelves((prevShelves) => [...prevShelves, rect]);

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('class', 'shelf-text');
    textElement.setAttribute('x', rect.x);
    textElement.setAttribute('y', rect.y + 20);
    textElement.textContent = `Item Name: ${itemName}\nNumber: ${number}`;
    svgRef.current.appendChild(textElement);
    setCurrentRect(null);
  };

  const getMousePosition = (event) => {
    const CTM = svgRef.current.getScreenCTM();
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d,
    };
  };

  const saveShelves = () => {
    const svgContent = svgContainerRef.current.innerHTML;
    const dataToSend = { mapName: 'MyFloorMap', svgContent, shelves };

    console.log('Data to send:', dataToSend);

    fetch('http://localhost:3000/save-shelves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Shelves saved:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <div className="controls">
        <input type="file" onChange={handleFileUpload} accept=".svg" />
        <button onClick={saveShelves}>Save Shelves</button>
      </div>
      <div
        ref={svgContainerRef}
        style={{
          width: '100%',
          height: '80vh',
          background: '#fff',
          border: '1px solid #ddd',
          position: 'relative',
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      </div>
    </div>
  );
};

export default MapDesigner;



