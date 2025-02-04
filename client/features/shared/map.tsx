"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { Box, Drawer } from "@mui/material";

const isMobile =
  typeof window !== "undefined" ? window.innerWidth <= 600 : false;
const appBarHeight = isMobile ? 54 : 64; // Default Material-UI AppBar height
import { SpotDrawer } from "../shared/spot-card-drawer";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapViewProps {
  category: keyof typeof categoryIcons;
  entities: any[]; // Replace with your entity type
}

const categoryIcons = {
  "tourist-info": L.icon({
    iconUrl: "/icons/marker.svg",
    iconSize: [35, 60],
  }),
  museums: L.icon({ iconUrl: "/icons/marker.svg", iconSize: [35, 60] }),
  food: L.icon({ iconUrl: "/icons/marker.svg", iconSize: [35, 60] }),
  events: L.icon({ iconUrl: "/icons/marker.svg", iconSize: [35, 60] }),
  accommodation: L.icon({
    iconUrl: "/icons/marker.svg",
    iconSize: [35, 60],
  }),
  trails: L.icon({ iconUrl: "/icons/marker.svg", iconSize: [35, 60] }),
};

export const MapView = ({ category, entities }: MapViewProps) => {
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (entities.length > 0) {
      setMapCenter([entities[0].latitude, entities[0].longitude]);
    }
  }, [entities]);

  const handleMarkerClick = (entity: any) => {
    setSelectedEntity(entity);
  };

  const handleDrawerClose = () => {
    setSelectedEntity(null);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: `${appBarHeight}px`,
        left: 0,
        width: "100%",
        height: `calc(100vh - ${appBarHeight}px)`,
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      {mapCenter && (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", padding: 0, margin: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {entities.map((entity) => (
            <Marker
              key={entity.id}
              position={[entity.latitude, entity.longitude]}
              icon={categoryIcons[category]}
              eventHandlers={{
                click: () => handleMarkerClick(entity),
              }}
            >
              <Popup>{entity.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      <Drawer
        anchor="right"
        open={!!selectedEntity}
        onClose={handleDrawerClose}
      >
        {selectedEntity && (
          <SpotDrawer
            item={selectedEntity}
            onClose={handleDrawerClose}
            open={false}
            images={[]}
          />
        )}
      </Drawer>
    </Box>
  );
};
