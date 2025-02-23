"use client";

import { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MUIButton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ArrowBack, FilterList, Map, ViewList } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import TouristGridExample from "@/features/tourist-info/pages/tourist-info-list";
import CulturSpotGrid from "@/features/culture/pages/culture-spot-list";
import FoodEstablishmentsGrid from "@/features/food/pages/food-establishments-list";
import AccommodationsGrid from "@/features/accommodation/pages/accommodation-card-list";
import EventGrid from "@/features/events/pages/events-list";
import TrailGrid from "@/features/trails/pages/trails-list";
import { useFilter } from "@/context/FilterContext";

const categories = [
  {
    value: "tourist-info",
    label: "Turist-Informationzentren",
    color: "#1e88e5",
  },
  { value: "events", label: "Veranstaltungen", color: "#e53935" },
  { value: "museums", label: "Kultur", color: "#446979" },
  { value: "accommodation", label: "Unterkünfte", color: "#8e24aa" },
  { value: "food", label: "Gastronomie", color: "#fb8c00" },
  { value: "trails", label: "Wandern", color: "#43a047" },
];

interface Suggestion {
  label: string;
  lat: number;
  lon: number;
  id: string;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function CategoryGrid() {
  const params = useParams();
  const category = params.category as string;
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentCategory =
    categories.find((cat) => cat.value === category) || categories[0];
  const [isMapView, setIsMapView] = useState(true);
  const [category1, setCategory] = useState(category);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterState, setFilterState } = useFilter();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const NEXT_PUBLIC_locationiq_api_key =
    process.env.NEXT_PUBLIC_locationiq_api_key || "";

  const [tempAddress, setTempAddress] = useState(filterState.address);
  const [tempLocation, setTempLocation] = useState(filterState.location);
  const [tempSuggestion, setTempSuggestion] = useState(filterState.suggestion);

  // Debounce function to optimize API calls
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${NEXT_PUBLIC_locationiq_api_key}&q=${encodeURIComponent(
            query
          )}&viewbox=13.5,51.0,14.5,52.0&bounded=1&limit=5&format=json`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const uniqueSuggestions = data.map((item: any) => ({
            label: item.display_name,
            lat: Number(item.lat),
            lon: Number(item.lon),
            id: `${item.place_id || Math.random().toString(36).substr(2, 9)}`,
          }));
          setSuggestions(uniqueSuggestions);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }, 300),
    []
  );

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  const applyFilter = () => {
    setFilterState({
      address: tempAddress,
      location: tempLocation,
      suggestion: tempSuggestion,
    });
    closeFilter();
    router.refresh();
  };

  const handleCategoryChange = (event: any) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    router.push(`/category/${newCategory}`);
  };

  const toggleView = () => setIsMapView(!isMapView);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: currentCategory.color,
          height: isMobile ? "56px" : "64px",
        }}
      >
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
            sx={{ color: "white", borderRadius: 4, fontSize: "1.1rem" }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Filter">
              <IconButton color="inherit" onClick={openFilter}>
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title={isMapView ? "Liste anzeigen" : "Karte anzeigen"}>
              <IconButton onClick={toggleView} color="inherit">
                {isMapView ? <ViewList /> : <Map />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        sx={{ pt: 8, pb: isMapView ? 0 : 5, height: "100%" }}
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
