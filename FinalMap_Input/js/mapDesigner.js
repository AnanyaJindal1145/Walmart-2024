let svgElement;
let isDrawing = false;
let startX, startY;
let currentRect;
const shelves = [];
const mapName = 'MyFloorMap';  // Define or prompt for a map name

document.getElementById('svgUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const svgContainer = document.getElementById('svgContainer');
            svgContainer.innerHTML = e.target.result;
            svgElement = svgContainer.querySelector('svg');

            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            svgElement.addEventListener('mousedown', startDrawing);
            svgElement.addEventListener('mousemove', drawRectangle);
            svgElement.addEventListener('mouseup', finishDrawing);
        };
        reader.readAsText(file);
    }
});

function startDrawing(event) {
    isDrawing = true;
    const point = getMousePosition(event);
    startX = point.x;
    startY = point.y;

    currentRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    currentRect.setAttribute('class', 'shelf-rect');
    currentRect.setAttribute('x', startX);
    currentRect.setAttribute('y', startY);
    currentRect.setAttribute('width', 0);
    currentRect.setAttribute('height', 0);
    svgElement.appendChild(currentRect);
}

function drawRectangle(event) {
    if (!isDrawing) return;

    const point = getMousePosition(event);
    const width = point.x - startX;
    const height = point.y - startY;

    currentRect.setAttribute('width', Math.abs(width));
    currentRect.setAttribute('height', Math.abs(height));
    if (width < 0) currentRect.setAttribute('x', point.x);
    if (height < 0) currentRect.setAttribute('y', point.y);
}

function finishDrawing(event) {
    if (!isDrawing) return;
    isDrawing = false;

    const number = prompt('Enter number for this rectangle:');
    const itemName = prompt('Enter item name for this rectangle:');

    const rect = {
        x: parseFloat(currentRect.getAttribute('x')),
        y: parseFloat(currentRect.getAttribute('y')),
        width: parseFloat(currentRect.getAttribute('width')),
        height: parseFloat(currentRect.getAttribute('height')),
        number: number,
        itemName: itemName
    };

    shelves.push(rect);

    // Add text element with item details
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('class', 'shelf-text');
    textElement.setAttribute('x', rect.x);
    textElement.setAttribute('y', rect.y + 20); // Positioned below the rectangle
    textElement.textContent = `Item Name: ${itemName}\nNumber: ${number}`;
    svgElement.appendChild(textElement);
}

document.getElementById('saveShelves').addEventListener('click', function() {
    const svgContent = svgElement.outerHTML; // Update this to the actual SVG content
    const dataToSend = { mapName: 'MyFloorMap', svgContent, shelves }; // Include mapName
    
    console.log('Data to send:', dataToSend); // Log the data being sent

    fetch('http://localhost:3000/save-shelves', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    }).then(response => response.json())
    .then(data => {
        console.log('Shelves saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function getMousePosition(event) {
    const CTM = svgElement.getScreenCTM();
    return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
    };
}
