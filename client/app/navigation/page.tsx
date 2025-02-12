"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createClient } from "@supabase/supabase-js";

// Create a custom MUI theme (customize as needed)
const theme = createTheme();

// Dynamically import the MapComponent to avoid SSR issues with Leaflet.
const MapComponent = dynamic(
  () => import("../../features/shared/navigation-map"),
  { ssr: false }
);
export default function NavigationPage() {
  // Extract coordinates from the URL query parameters.
  const searchParams = useSearchParams();
  const currentLat = searchParams.get("currentLat")
    ? Number(searchParams.get("currentLat"))
    : undefined;
  const currentLon = searchParams.get("currentLon")
    ? Number(searchParams.get("currentLon"))
    : undefined;
  const goalLat = searchParams.get("goalLat")
    ? Number(searchParams.get("goalLat"))
    : undefined;
  const goalLon = searchParams.get("goalLon")
    ? Number(searchParams.get("goalLon"))
    : undefined;

  // Validate and construct coordinate arrays.
  const userLocation: [number, number] | null =
    currentLat !== undefined && currentLon !== undefined
      ? [currentLat, currentLon]
      : null;
  const attractionLocation: [number, number] | null =
    goalLat !== undefined && goalLon !== undefined ? [goalLat, goalLon] : null;

  // State to hold the parking location returned from Supabase.
  const [parkingLocation, setParkingLocation] = useState<
    [number, number] | null
  >(null);
  // Define a type for route details.
  interface RouteDetails {
    driving: {
      distance: number;
      time: number;
    };
    walking: {
      distance: number;
      time: number;
    };
  }

  // State to hold route details (e.g. distance, time) for display.
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  // State to control the MUI Drawer (for mobile devices).
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use media queries for responsive design.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize Supabase client using environment variables.

  // If the attraction (goal) coordinates are available, call the Supabase RPC.

  // Callback to receive route details from the MapComponent.
  const handleRouteFound = (details: RouteDetails) => {
    setRouteDetails(details);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Content for the Drawer – displays route details if available.
  const drawerContent = (
    <Box sx={{ width: isMobile ? 250 : 300, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Route Details
      </Typography>
      {routeDetails ? (
        <List>
          <ListItem>
            <ListItemText
              primary="Driving Leg"
              secondary={`Distance: ${routeDetails.driving.distance.toFixed(
                2
              )} km, Time: ${routeDetails.driving.time} min`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Walking Leg"
              secondary={`Distance: ${routeDetails.walking.distance.toFixed(
                2
              )} km, Time: ${routeDetails.walking.time} min`}
            />
          </ListItem>
        </List>
      ) : (
        <Typography variant="body2">Calculating route...</Typography>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Drawer: permanent for desktop, temporary for mobile */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={toggleDrawer}
              ModalProps={{ keepMounted: true }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer variant="permanent" anchor="left" open>
              {drawerContent}
            </Drawer>
          )}
          <Box sx={{ flexGrow: 1 }}>
            {userLocation && attractionLocation ? (
              <MapComponent
                userLocation={userLocation}
                attractionLocation={attractionLocation}
                onRouteFound={handleRouteFound}
              />
            ) : (
              <Box p={2}>
                <Typography variant="h6">Missing Coordinates</Typography>
                <Typography variant="body1">
                  Please provide <code>currentLat</code>,{" "}
                  <code>currentLon</code>,<code>goalLat</code> and{" "}
                  <code>goalLon</code> in the URL query.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
