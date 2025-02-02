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
} from "@mui/material";
import { ArrowBack, Map } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import TouristGridExample from "@/features/tourist-info/pages/tourist-info-list";
import CulturSpotGrid from "@/features/culture/pages/culture-spot-list";
import FoodEstablishmentsGrid from "@/features/food/pages/culture-spot-list";
import AccommodationsGrid from "@/features/accommodation/pages/accommodation-card-list";
import EventGrid from "@/features/events/pages/culture-spot-list";
import TrailGrid from "@/features/trails/pages/trails-list";

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category1, setCategory] = useState(category); // Use category from useParams
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);

        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );
        if (error) throw error;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleCategoryChange = (event: any) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    router.push(`/category/${newCategory}`);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          bgcolor: currentCategory.color,
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar>
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
              flex: 1,
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiSelect-select": {
                py: 1,
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>

          <IconButton>
            <Map />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        sx={{
          pt: 8, // Add top padding
          pb: 5, // Add bottom padding
          px: { xs: 2, sm: 3, md: 5 }, // Responsive horizontal padding
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Toolbar />
        {category === "tourist-info" && <TouristGridExample />}
        {category === "museums" && <CulturSpotGrid />}
        {category === "food" && <FoodEstablishmentsGrid />}
        {category === "events" && <EventGrid />}
        {category === "accommodation" && <AccommodationsGrid />}
        {category === "trails" && <TrailGrid />}
      </Container>
    </Box>
  );
}

//create a function that parses the images from the database
