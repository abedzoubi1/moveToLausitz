import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { SpotCard } from "../../shared/spot-card";
import { getCulturSpots } from "../api/get-culture-spots";
import { cultureSpot } from "./types";
import { MapView } from "@/features/shared/map";

interface CulturSpotGridProps {
  isMapView: boolean;
}

const CulturspotG = ({ cultureSpots }: { cultureSpots: cultureSpot[] }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Horizontal centering
        alignItems: "center", // Vertical centering
      }}
    >
      <Container className="p-4" maxWidth="md">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {cultureSpots.map((cultureSpots, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <SpotCard {...cultureSpots} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const CulturSpotGrid = ({ isMapView }: CulturSpotGridProps) => {
  const [centers, setSpots] = useState<cultureSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getCulturSpots();
        setSpots(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return isMapView ? (
    <MapView category="museums" entities={centers} />
  ) : (
    <CulturspotG cultureSpots={centers} />
  );
};

export default CulturSpotGrid;
