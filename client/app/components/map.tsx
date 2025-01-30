"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  infoCenters: any[];
  selectedCenter: any | null;
  onCenterSelect: (center: any) => void;
}

export default function Map({
  userLocation,
  infoCenters,
  selectedCenter,
  onCenterSelect,
}: MapProps) {
  useEffect(() => {
    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User location marker */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={L.divIcon({
          className: "user-location-marker",
          html: "📍",
          iconSize: [25, 25],
        })}
      >
        <Popup>Your location</Popup>
      </Marker>

      {/* Info centers markers */}
      {infoCenters.map((center) => (
        <Marker
          key={center.id}
          position={[center.latitude, center.longitude]}
          icon={L.divIcon({
            className: "info-center-marker",
            html: selectedCenter?.id === center.id ? "🔵" : "📌",
            iconSize: [25, 25],
          })}
          eventHandlers={{
            click: () => onCenterSelect(center),
          }}
        >
          <Popup>
            <h3>{center.name}</h3>
            <p>{center.address}</p>
            {center.opening_hours && <p>Open: {center.opening_hours}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
