"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Container,
} from "@mui/material";
import { ArrowBack, Map } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";
import TouristGridExample from "@/features/tourist-info/pages/tourist-info-list";

interface TouristInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  locality: string;
  postal_code: string;
  images: string;
  opening_hours: string;
  telephone: string;
  url: string;
  distance: number;
}

interface Props {
  params: { category: string };
  window: () => Window;
}

const categories = [
  { value: "tourist-info", label: "Tourist Information", color: "#1e88e5" },
  { value: "events", label: "Events", color: "#e53935" },
  { value: "museums", label: "Museums", color: "#43a047" },
  { value: "accommodation", label: "Accommodation", color: "#8e24aa" },
  { value: "food", label: "Restaurants", color: "#fb8c00" },
  { value: "trails", label: "Trails", color: "#3949ab" },
];

export default function TouristInfoPage({ window, params }: Props) {
  const { category } = params;
  const [places, setPlaces] = useState<TouristInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<TouristInfo | null>(null);
  const [category1, setCategory] = useState(params.category);
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
      <AppBar component="nav">
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
      </Container>
    </Box>
  );
}

//create a function that parses the images from the database
