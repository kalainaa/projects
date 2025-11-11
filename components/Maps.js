import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon
const customIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
    shadowSize: [41, 41] // size of the shadow
});

// Maps component
const Maps = ({ onExit }) => {
    const position = [51.505, -0.09]; // Example coordinates (latitude, longitude)

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
            <button 
                onClick={onExit} 
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '10px 15px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000 // Ensure the button is above the map
                }}
            >
                Exit Map
            </button>
        </div>
    );
};

export default Maps;
