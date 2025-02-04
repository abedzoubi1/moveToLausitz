import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { SpotCard } from "../../shared/spot-card";
import { getTrails } from "../api/get-trails";
import { Trails, location } from "./types";
import { MapView } from "@/features/shared/map";

interface TrailGridProps {
  isMapView: boolean;
}

const TrailG = ({ trail }: { trail: Trails[] }) => {
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
          {trail.map((trail, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <SpotCard
                email={undefined}
                address={trail.start_location.address}
                locality={trail.start_location.locality}
                postal_code={trail.start_location.postal_code}
                country={trail.start_location.country}
                latitude={trail.start_location.latitude}
                longitude={trail.start_location.longitude}
                telephone={null}
                opening_hours={""}
                is_accessible_for_free={null}
                {...trail}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const TrailGrid = ({ isMapView }: TrailGridProps) => {
  const [centers, setSpots] = useState<Trails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getTrails();
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
    <MapView category={"trails"} entities={centers} />
  ) : (
    <TrailG trail={centers} />
  );
};

export default TrailGrid;
