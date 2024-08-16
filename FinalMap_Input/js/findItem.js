
document.addEventListener('DOMContentLoaded', function () {
    const itemSelect = document.getElementById('itemSelect');
    const itemMarker = document.getElementById('itemMarker');

    // Define offset values (adjust these values as needed)
    const xOffset = 435; // Adjust this for horizontal alignment
    const yOffset = 235; // Adjust this for vertical alignment

    // Fetch item data from the server
    fetch('http://localhost:8000/items')
        .then(response => response.json())
        .then(data => {
            // Populate the select dropdown with items
            for (const itemName in data) {
                const option = document.createElement('option');
                option.value = itemName;
                option.textContent = itemName;
                itemSelect.appendChild(option);
            }

            // Render boxes on the map
            for (const itemName in data) {
                const item = data[itemName];
                const box = document.createElement('div');
                box.classList.add('box');
                box.style.top = `${item.y + yOffset}px`;
                box.style.left = `${item.x + xOffset}px`;
                box.style.width = `${item.width}px`;
                box.style.height = `${item.height}px`;
                box.innerHTML = `<div class="box-number">${item.number}</div>`;
                document.getElementById('mapContainer').appendChild(box);
            }

            itemSelect.addEventListener('change', function () {
                const selectedItem = data[this.value];
                if (selectedItem) {
                    itemMarker.style.top = `${selectedItem.y + yOffset}px`;
                    itemMarker.style.left = `${selectedItem.x + xOffset}px`;
                    itemMarker.style.width = `${selectedItem.width}px`;
                    itemMarker.style.height = `${selectedItem.height}px`;
                    itemMarker.textContent = this.value;
                    itemMarker.classList.add('visible');
                } else {
                    itemMarker.classList.remove('visible');
                }
            });
        })
        .catch(error => console.error('Error fetching items:', error));
});
