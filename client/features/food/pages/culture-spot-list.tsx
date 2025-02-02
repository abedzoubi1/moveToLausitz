import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { SpotCard } from "../../shared/spot-card";
import { getFoodEstablishments } from "../api/get-food-establishments";
import { foodEstablishment } from "./types";

const CulturspotG = ({
  foodEstablishments,
}: {
  foodEstablishments: foodEstablishment[];
}) => {
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
          {foodEstablishments.map((foodEstablishments, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <SpotCard is_accessible_for_free={null} {...foodEstablishments} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const FoodEstablishmentsGrid = () => {
  const [centers, setSpots] = useState<foodEstablishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getFoodEstablishments();
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

  return <CulturspotG foodEstablishments={centers} />;
};

export default FoodEstablishmentsGrid;
