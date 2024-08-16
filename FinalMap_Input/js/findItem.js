document.addEventListener('DOMContentLoaded', function() {
    const itemSelect = document.getElementById('itemSelect');
    const storeMap = document.getElementById('storeMap');
    let items = {};

    // Fetch item data from the server
    fetch('http://localhost:8000/items')
        .then(response => response.json())
        .then(data => {
            items = data;
            populateSelectBox();
            renderStoreMap();
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });

    itemSelect.addEventListener('change', function() {
        renderStoreMap();
    });

    function populateSelectBox() {
        for (const itemId in items) {
            const option = document.createElement('option');
            option.value = itemId;
            option.textContent = itemId;
            itemSelect.appendChild(option);
        }
    }

    function renderStoreMap() {
        storeMap.innerHTML = ''; // Clear the map

        for (const [itemId, item] of Object.entries(items)) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.style.top = `${item.y}px`;
            box.style.left = `${item.x}px`;
            box.style.width = `${item.width}px`;
            box.style.height = `${item.height}px`;

            const boxNumber = document.createElement('div');
            boxNumber.classList.add('box-number');
            boxNumber.textContent = item.number;

            box.appendChild(boxNumber);
            storeMap.appendChild(box);
        }

        const selectedItem = itemSelect.value;
        if (selectedItem) {
            const marker = document.createElement('div');
            marker.classList.add('marker');
            const item = items[selectedItem];
            marker.style.top = `${item.y}px`;
            marker.style.left = `${item.x}px`;
            marker.style.width = `${item.width}px`;
            marker.style.height = `${item.height}px`;

            const markerText = document.createElement('div');
            markerText.classList.add('marker-text');
            markerText.textContent = 'Selected Item';

            marker.appendChild(markerText);
            storeMap.appendChild(marker);
        }
    }
});
