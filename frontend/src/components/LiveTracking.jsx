import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultPosition = [23.0225, 72.5714]; // Ahmedabad

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported");
      return;
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.log("Location error:", error);
        setCurrentPosition(defaultPosition);
      }
    );

    // Continuously watch location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Position updated:", latitude, longitude);

        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.log("Watch position error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (!currentPosition) {
    return <div>Getting your location...</div>;
  }

  return (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <RecenterMap position={currentPosition} />

      <Marker position={currentPosition}>
        <Popup>
          You are here
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveTracking;