"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  ArrowBack,
  Map,
  ChevronRight,
  LocationOn,
  AccessTime,
  Phone,
  Language,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://nwnppjevoiqqnwegsmvr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bnBwamV2b2lxcW53ZWdzbXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDg1MTYsImV4cCI6MjA1MDgyNDUxNn0.xmqYac_6EZPXOdCLrZJOhrdpHaqDaJkTGGD7zWcBGf0";

const client = createClient(supabaseUrl, supabaseKey);

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

const categories = [
  { value: "tourist-info", label: "Tourist Information", color: "#1e88e5" },
  { value: "events", label: "Events", color: "#e53935" },
  { value: "museums", label: "Museums", color: "#43a047" },
  { value: "accommodation", label: "Accommodation", color: "#8e24aa" },
  { value: "food", label: "Restaurants", color: "#fb8c00" },
  { value: "trails", label: "Trails", color: "#3949ab" },
];

export default function TouristInfoPage() {
  const [places, setPlaces] = useState<TouristInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<TouristInfo | null>(null);
  const [category, setCategory] = useState("tourist-info");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);

        Get user's location
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        // Correct query with proper PostGIS syntax
        const { data, error } = await client
          .from("tourist_info_centers")
          .select(
            `*,
    ST_Distance(
      geom,
      ST_SetSRID(ST_MakePoint(${position.coords.longitude}, ${position.coords.latitude}), 4326)::geography
    ) AS distance_meters
  `
          )
          // .filter(
          //   "ST_DWithin(geom, ST_SetSRID(ST_MakePoint(${position.coords.longitude}, ${position.coords.latitude}), 4326)::geography, 10000)",
          //   "eq",
          //   true
          // )
          .order("distance_meters", { ascending: true });

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

  const formatDistance = (meters: number) => {
    return meters < 1000
      ? `${Math.round(meters)}m`
      : `${(meters / 1000).toFixed(1)}km`;
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="fixed" sx={{ bgcolor: categories[0].color }}>
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

          <IconButton
            color="inherit"
            onClick={() => router.push("/category/tourist-info/map")}
          >
            <Map />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ pt: 10, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            {places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                    transition: "all 0.2s",
                  }}
                  onClick={() => setSelectedPlace(place)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box
                      component="img"
                      src={JSON.parse(place.images)[0]}
                      alt={place.name}
                      sx={{
                        width: { xs: "100%", sm: 200 },
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {place.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {place.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDistance(place.distance)} away
                          </Typography>
                        </Box>
                        <Chip
                          icon={<ChevronRight />}
                          label="View Details"
                          size="small"
                          sx={{ bgcolor: "#1e88e520", color: "#1e88e5" }}
                        />
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Container>

      <Dialog
        fullScreen={isMobile}
        open={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedPlace && (
          <>
            <DialogTitle sx={{ pr: 6, position: "relative" }}>
              {selectedPlace.name}
              <IconButton
                onClick={() => setSelectedPlace(null)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                component="img"
                src={JSON.parse(selectedPlace.images)[0]}
                alt={selectedPlace.name}
                sx={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Typography paragraph>{selectedPlace.description}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography>
                    {selectedPlace.address}, {selectedPlace.postal_code}{" "}
                    {selectedPlace.locality}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime color="action" />
                  <Typography>{selectedPlace.opening_hours}</Typography>
                </Box>
                {selectedPlace.telephone && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone color="action" />
                    <Typography>{selectedPlace.telephone}</Typography>
                  </Box>
                )}
                {selectedPlace.url && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Language color="action" />
                    <Link
                      href={selectedPlace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Link>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPlace(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
