import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useSSE } from '../context/SSEContext';

// Fix for default marker icon
const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center when coordinates change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const MapPage: React.FC = () => {
  const { maps, connected } = useSSE();
  const [position, setPosition] = useState<[number, number]>([26.4499, 80.3319]);
  
  useEffect(() => {
    if (maps && typeof maps.latitude === 'number' && typeof maps.longitude === 'number') {
      console.log('Updating position with:', maps); // Debug log
      setPosition([maps.latitude, maps.longitude]);
    }
  }, [maps]);

  // Show loading state when not connected
  if (!connected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-mono text-gray-500">Waiting for connection...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="bg-gray-200 rounded-lg p-4 flex justify-between items-center">
        <div className="font-mono text-xl">Time: {maps?.time || 'N/A'}</div>
        <div className="font-mono text-xl">Latitude: {position[0].toFixed(6)}</div>
        <div className="font-mono text-xl">Longitude: {position[1].toFixed(6)}</div>
      </div>
      <div className="flex-1 bg-gray-200 rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={position}
            icon={defaultIcon}
          >
            <Popup>
              CanSat Location<br />
              Time: {maps?.time || 'N/A'}<br />
              Lat: {position[0].toFixed(6)}<br />
              Lng: {position[1].toFixed(6)}
            </Popup>
          </Marker>
          <Circle
            center={position}
            radius={1000}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />
          <MapUpdater lat={position[0]} lng={position[1]} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;