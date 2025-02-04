"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowBack, Map, ViewList } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import TouristGridExample from "@/features/tourist-info/pages/tourist-info-list";
import CulturSpotGrid from "@/features/culture/pages/culture-spot-list";
import FoodEstablishmentsGrid from "@/features/food/pages/food-establishments-list";
import AccommodationsGrid from "@/features/accommodation/pages/accommodation-card-list";
import EventGrid from "@/features/events/pages/events-list";
import TrailGrid from "@/features/trails/pages/trails-list";
import { MapView } from "@/features/shared/map";

const categories = [
  {
    value: "tourist-info",
    label: "Turist-Informationzentren",
    color: "#1e88e5",
  },
  { value: "events", label: "Veranstaltungen", color: "#e53935" },
  { value: "museums", label: "Kultur", color: "#43a047" },
  { value: "accommodation", label: "Unterkünfte", color: "#8e24aa" },
  { value: "food", label: "Gastronomie", color: "#fb8c00" },
  { value: "trails", label: "Wandern", color: "#3949ab" },
];
interface Props {
  window?: () => Window;
}

export default function CategoryGrid({ window }: Props) {
  // Remove params from props
  const params = useParams(); // Use useParams hook
  const category = params.category as string; // Access category from params
  const currentCategory =
    categories.find((cat) => cat.value === category) || categories[0];
  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category1, setCategory] = useState(category); // Use category from useParams
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCategoryChange = (event: any) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    router.push(`/category/${newCategory}`);
    setIsMapView(false); // Reset to ListView when changing categories
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const toggleView = () => {
    setIsMapView(!isMapView);
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: currentCategory.color }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push("/")}
          >
            <ArrowBack />
          </IconButton>
          <Select
            value={category}
            onChange={handleCategoryChange}
            sx={{
              mx: 2,
              minWidth: "200px",
              color: "white",
              borderRadius: 4,
              fontSize: "1.1rem",
              "& .MuiSelect-select": {
                padding: "8px 16px",
                borderRadius: 4,
                fontSize: "1.1rem",
              },
              "& .MuiMenuItem-root": {
                fontSize: "1.1rem",
              },
              border: "2px solid white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
          <Tooltip title={isMapView ? "Liste anzeigen" : "Karte anzeigen"}>
            <IconButton
              onClick={toggleView}
              color="inherit"
              aria-label={
                isMapView
                  ? "Zur Listenansicht wechseln"
                  : "Zur Kartenansicht wechseln"
              }
            >
              {isMapView ? <ViewList /> : <Map />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        sx={{
          pt: 8,
          pb: isMapView ? 0 : 5,
          px: isMapView ? 0 : { xs: 2, sm: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        {category === "tourist-info" && (
          <TouristGridExample isMapView={isMapView} />
        )}
        {category === "museums" && <CulturSpotGrid isMapView={isMapView} />}
        {category === "food" && (
          <FoodEstablishmentsGrid isMapView={isMapView} />
        )}
        {category === "events" && <EventGrid isMapView={isMapView} />}
        {category === "accommodation" && (
          <AccommodationsGrid isMapView={isMapView} />
        )}
        {category === "trails" && <TrailGrid isMapView={isMapView} />}
      </Container>
    </Box>
  );
}
