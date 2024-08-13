import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import './App.css';

const App = () => {
    const [mapId, setMapId] = useState(null);
    const [elements, setElements] = useState([]);
    const [name, setName] = useState('');
    const [selectedElementIndex, setSelectedElementIndex] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    // Add new element to the map
    const addElement = (type) => {
        setElements([...elements, { type, x: 100, y: 100, width: 100, height: 100 }]);
    };

    // Handle drag events
    const handleDrag = (index, e, data) => {
        const newElements = [...elements];
        newElements[index] = { ...newElements[index], x: data.x, y: data.y };
        setElements(newElements);
    };

    // Handle resizing of elements
    const handleResize = (index, e, data) => {
        const newElements = [...elements];
        newElements[index] = { ...newElements[index], width: data.size.width, height: data.size.height };
        setElements(newElements);
    };

    // Save map to the backend
    const saveMap = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/maps', { id: mapId, name, elements });
            if (!mapId) {
                setMapId(response.data.id);
            }
            alert('Map saved successfully!');
        } catch (error) {
            alert('Error saving map');
        }
    };

    // Load map from the backend
    const loadMap = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/maps/${id}`);
            setName(response.data.name);
            setElements(response.data.elements);
            setMapId(id);
        } catch (error) {
            alert('Error loading map');
        }
    };

    // Show context menu
    const handleContextMenu = (e, index) => {
        e.preventDefault();
        setSelectedElementIndex(index);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
        setShowContextMenu(true);
    };

    // Delete selected element
    const deleteElement = () => {
        setElements(elements.filter((_, i) => i !== selectedElementIndex));
        setShowContextMenu(false);
    };

    useEffect(() => {
        // Optionally load a default map
        // loadMap('some-map-id');
    }, []);

    return (
        <div className="app-container">
            <h1>Store Map Designer</h1>
            <div className="controls">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Map Name"
                />
                <button className="btn" onClick={() => addElement('rectangle')}>Add Rectangle</button>
                <button className="btn" onClick={() => addElement('circle')}>Add Circle</button>
                <button className="btn" onClick={saveMap}>Save Map</button>
                <button className="btn" onClick={() => loadMap(mapId)}>Load Map</button>
            </div>
            <div
                className="map-container"
                onClick={() => setShowContextMenu(false)}
            >
                {elements.map((element, index) => (
                    <Draggable
                        key={index}
                        onStop={(e, data) => handleDrag(index, e, data)}
                        position={{ x: element.x, y: element.y }}
                        onContextMenu={(e) => handleContextMenu(e, index)}
                    >
                        <div
                            style={{
                                width: element.width,
                                height: element.height,
                                backgroundColor: element.type === 'rectangle' ? 'blue' : 'red',
                                borderRadius: element.type === 'circle' ? '50%' : '0',
                                cursor: 'move',
                            }}
                            className="map-element"
                        />
                    </Draggable>
                ))}
                {showContextMenu && (
                    <div
                        className="context-menu"
                        style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                    >
                        <button onClick={deleteElement}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
