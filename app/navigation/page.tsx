"use client";

import React, { useState, Suspense, use, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  IconButton,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ArrowBack } from "@mui/icons-material";
import { useSearchParams, useRouter } from "next/navigation";
import { useFilter } from "@/context/FilterContext";

const theme = createTheme();

const MapComponent = dynamic(
  () => import("../../features/shared/navigation-map"),
  { ssr: false }
);

function NavigationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { filterState } = useFilter();
  const [alertOpen, setAlertOpen] = useState(true);

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

  const userLocation: [number, number] | null =
    currentLat !== undefined && currentLon !== undefined
      ? [currentLat, currentLon]
      : null;
  const attractionLocation: [number, number] | null =
    goalLat !== undefined && goalLon !== undefined ? [goalLat, goalLon] : null;

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

  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRouteFound = (details: RouteDetails) => {
    setRouteDetails(details);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  useEffect(() => {
    if (routeDetails && routeDetails.walking.distance === -1) {
      setAlertOpen(true);
    }
  }, [routeDetails]);

  const drawerContent = (
    <Box sx={{ width: isMobile ? 250 : 300, p: 2, pt: 8 }}>
      <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
        Route Details
      </Typography>
      {routeDetails ? (
        <List>
          {routeDetails.walking.distance === -1 ? (
            <ListItem>
              <ListItemText
                primary="Fahrtroute zum Ziel"
                secondary={`Entfernung: ${routeDetails.driving.distance.toFixed(
                  2
                )} km, Zeit: ${routeDetails.driving.time} min`}
              />
            </ListItem>
          ) : (
            <>
              <ListItem>
                <ListItemText
                  primary="Fahrtroute zum Parkplatz"
                  secondary={`Entfernung: ${routeDetails.driving.distance.toFixed(
                    2
                  )} km, Zeit: ${routeDetails.driving.time} min`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Fußweg vom Parkplatz zum Ziel"
                  secondary={`Entfernung: ${routeDetails.walking.distance.toFixed(
                    2
                  )} km, Zeit: ${routeDetails.walking.time} min`}
                />
              </ListItem>
            </>
          )}
        </List>
      ) : (
        <Typography variant="body2">Calculating route...</Typography>
      )}
    </Box>
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* if walking distance is -1, then alert user */}
      {routeDetails && routeDetails.walking.distance === -1 && alertOpen && (
        <Alert
          severity="warning"
          onClose={() => setAlertOpen(false)}
          sx={{ position: "fixed", top: 16, right: 16, left: 16, zIndex: 1400 }}
        >
          Es wurde kein Parkplatz in der Nähe des Ziels gefunden. Bitte
          überprüfen Sie die Umgebung selbst.
        </Alert>
      )}
      <IconButton
        edge="start"
        sx={{
          position: "fixed",
          top: 16,
          left: 25,
          zIndex: 1300,
          bgcolor: "background.paper",
          boxShadow: 1,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        color="inherit"
        onClick={() => router.back()}
      >
        <ArrowBack />
      </IconButton>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
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
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
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
                Please provide <code>currentLat</code>, <code>currentLon</code>,
                <code>goalLat</code>, and <code>goalLon</code> in the URL query.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default function NavigationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationPageContent />
    </Suspense>
  );
}
