let svgElement;
let isDrawing = false;
let startX, startY;
let currentRect;
const shelves = [];

document.getElementById('svgUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const svgContainer = document.getElementById('svgContainer');
            svgContainer.innerHTML = e.target.result;
            svgElement = svgContainer.querySelector('svg');

            // Ensure the SVG is responsive
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            // Add event listener for drawing rectangles
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

    const rect = {
        x: parseFloat(currentRect.getAttribute('x')),
        y: parseFloat(currentRect.getAttribute('y')),
        width: parseFloat(currentRect.getAttribute('width')),
        height: parseFloat(currentRect.getAttribute('height'))
    };

    shelves.push(rect);
}

function getMousePosition(event) {
    const CTM = svgElement.getScreenCTM();
    return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
    };
}

// Save the shelves to the backend
document.getElementById('saveShelves').addEventListener('click', function() {
    console.log('Shelves:', shelves); // This is where you would send the data to the backend
    fetch('/save-shelves', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shelves }),
    }).then(response => response.json())
    .then(data => {
        console.log('Shelves saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
