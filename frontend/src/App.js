// Import necessary modules
import React, { useState, useRef } from 'react';

// Define the React component
const App = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentRect, setCurrentRect] = useState(null);
    const [shelves, setShelves] = useState([]);
    const svgRef = useRef(null);
    const mapName = 'MyFloorMap'; // Define or prompt for a map name

    // Handle SVG file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const svgContainer = svgRef.current;
                svgContainer.innerHTML = e.target.result;
                const svgElement = svgContainer.querySelector('svg');
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

    // Start drawing the rectangle
    const startDrawing = (event) => {
        setIsDrawing(true);
        const point = getMousePosition(event);
        const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        newRect.setAttribute('class', 'shelf-rect');
        newRect.setAttribute('x', point.x);
        newRect.setAttribute('y', point.y);
        newRect.setAttribute('width', 0);
        newRect.setAttribute('height', 0);
        svgRef.current.appendChild(newRect);
        setCurrentRect(newRect);
    };

    // Draw the rectangle as the mouse moves
    const drawRectangle = (event) => {
        if (!isDrawing || !currentRect) return;
        const point = getMousePosition(event);
        const width = point.x - parseFloat(currentRect.getAttribute('x'));
        const height = point.y - parseFloat(currentRect.getAttribute('y'));
        currentRect.setAttribute('width', Math.abs(width));
        currentRect.setAttribute('height', Math.abs(height));
        if (width < 0) currentRect.setAttribute('x', point.x);
        if (height < 0) currentRect.setAttribute('y', point.y);
    };

    // Finish drawing the rectangle and prompt for details
    const finishDrawing = (event) => {
        if (!isDrawing || !currentRect) return;
        setIsDrawing(false);
        const number = prompt('Enter number for this rectangle:');
        const itemName = prompt('Enter item name for this rectangle:');
        const rectData = {
            x: parseFloat(currentRect.getAttribute('x')),
            y: parseFloat(currentRect.getAttribute('y')),
            width: parseFloat(currentRect.getAttribute('width')),
            height: parseFloat(currentRect.getAttribute('height')),
            number: number,
            itemName: itemName
        };
        setShelves([...shelves, rectData]);

        // Add text element with item details
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('class', 'shelf-text');
        textElement.setAttribute('x', rectData.x);
        textElement.setAttribute('y', rectData.y + 20); // Positioned below the rectangle
        textElement.textContent = `Item Name: ${itemName}\nNumber: ${number}`;
        svgRef.current.appendChild(textElement);
    };

    // Save the shelves data
    const saveShelves = () => {
        const svgContent = new XMLSerializer().serializeToString(svgRef.current.querySelector('svg'));
        const dataToSend = { mapName, svgContent, shelves };
        console.log('Data to send:', dataToSend);

        fetch('http://localhost:3000/save-shelves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shelves saved:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    // Get mouse position relative to the SVG
    const getMousePosition = (event) => {
        const svgElement = svgRef.current.querySelector('svg');
        const CTM = svgElement.getScreenCTM();
        return {
            x: (event.clientX - CTM.e) / CTM.a,
            y: (event.clientY - CTM.f) / CTM.d
        };
    };

    return (
        <div>
            <div className="controls">
                <input type="file" id="svgUpload" accept=".svg" onChange={handleFileUpload} />
                <button id="saveShelves" onClick={saveShelves}>Save Shelves</button>
            </div>
            <div id="svgContainer" ref={svgRef}></div>
        </div>
    );
};

export default App;
