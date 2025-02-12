"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Drawer } from "@mui/material";
import { SpotDrawer } from "../shared/spot-card-drawer";
import "leaflet/dist/leaflet.css";
import { convertImageUrlsString } from "./func";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

const initializeLeaflet = async () => {
  const L = (await import("leaflet")).default;
  await import("leaflet.awesome-markers");
  await import("leaflet.markercluster");

  return {
    "tourist-info": L.AwesomeMarkers.icon({
      icon: "info",
      markerColor: "blue",
      prefix: "fa",
    }),
    museums: L.AwesomeMarkers.icon({
      icon: "university",
      markerColor: "cadetblue",
      prefix: "fa",
    }),
    food: L.AwesomeMarkers.icon({
      icon: "cutlery",
      markerColor: "orange",
      prefix: "fa",
    }),
    events: L.AwesomeMarkers.icon({
      icon: "calendar",
      markerColor: "red",
      prefix: "fa",
    }),
    accommodation: L.AwesomeMarkers.icon({
      icon: "bed",
      markerColor: "purple",
      prefix: "fa",
    }),
    trails: L.AwesomeMarkers.icon({
      icon: "tree",
      markerColor: "green",
      prefix: "fa",
    }),
  };
};

// Dynamically import Leaflet components
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
const MarkerCluster = dynamic(() => import("react-leaflet-markercluster"), {
  ssr: false,
});

interface MapViewProps {
  category: string;
  entities: any[];
}

export const MapView = ({ category, entities }: MapViewProps) => {
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [categoryIcons, setCategoryIcons] = useState<any>(null);

  useEffect(() => {
    // Initialize Leaflet and awesome-markers only on client-side
    initializeLeaflet().then((icons) => {
      setCategoryIcons(icons);
    });

    // Set mobile state
    setIsMobile(window.innerWidth <= 600);

    // Handle window resize
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Set initial map center when entities are available
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

  // Don't render the map until categoryIcons are initialized
  if (!categoryIcons) return null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.awesome-markers/2.0.4/leaflet.awesome-markers.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <Box
        sx={{
          position: "fixed",
          top: isMobile ? "56px" : "64px", // offset for the AppBar
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {mapCenter && (
          <MapContainer
            center={mapCenter}
            zoom={13}
            maxZoom={19}
            style={{ height: "100%", width: "100%", padding: 0, margin: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup
              animate={true}
              showCoverageOnHover={true}
              disableClusteringAtZoom={isMobile ? 13 : 14}
            >
              {entities.map((entity) => (
                <Marker
                  key={entity.id}
                  position={[entity.latitude, entity.longitude]}
                  icon={categoryIcons[category]}
                  eventHandlers={{ click: () => handleMarkerClick(entity) }}
                />
              ))}
            </MarkerClusterGroup>
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
              open={true}
              images={convertImageUrlsString(
                Array.isArray(selectedEntity.images)
                  ? JSON.stringify(selectedEntity.images)
                  : selectedEntity.images
              )}
              currentCoords={{
                lon: 14.332868,
                lat: 51.67355,
              }}
            />
          )}
        </Drawer>
      </Box>
    </>
  );
};
