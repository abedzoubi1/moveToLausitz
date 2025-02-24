import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { TouristInfoCard } from "./tourist-info-card";
import { TouristInfoCenter } from "./types";
import { getTouristInfoSpots } from "../api/get-tourists";
import { MapView } from "@/features/shared/map";
import { useFilter } from "@/context/FilterContext";

interface TouristGridProps {
  isMapView: boolean;
}

const TouristGrid = ({ infoCenter }: { infoCenter: TouristInfoCenter[] }) => {
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
          {infoCenter.map((infoCenter, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <TouristInfoCard {...infoCenter} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const TouristGridExample = ({ isMapView }: TouristGridProps) => {
  const [centers, setCenters] = useState<TouristInfoCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filterState } = useFilter();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getTouristInfoSpots(
          filterState.location!.lng,
          filterState.location!.lat
        );
        setCenters(data);
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
  }, [filterState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return isMapView ? (
    <MapView category={"tourist-info"} entities={centers} />
  ) : (
    <TouristGrid infoCenter={centers} />
  );
};

export default TouristGridExample;
