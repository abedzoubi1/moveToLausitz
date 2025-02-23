import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { SpotCard } from "../../shared/spot-card";
import { lodgingBusiness } from "./types";
import { getAccommodation } from "../api/get-accommodations";
import { MapView } from "@/features/shared/map";
import { useFilter } from "@/context/FilterContext";

interface AccommodationGridProps {
  isMapView: boolean;
}
const AccommodationG = ({
  accommodations,
}: {
  accommodations: lodgingBusiness[];
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
          {accommodations.map((accommodations, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <SpotCard
                schedule={undefined}
                type_of_trail={undefined}
                distance={undefined}
                opening_hours={""}
                is_accessible_for_free={null}
                {...accommodations}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const AccommodationsGrid = ({ isMapView }: AccommodationGridProps) => {
  const [centers, setSpots] = useState<lodgingBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filterState } = useFilter();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getAccommodation(
          filterState.location!.lng,
          filterState.location!.lat
        );
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
    <MapView category="accommodation" entities={centers} />
  ) : (
    <AccommodationG accommodations={centers} />
  );
};

export default AccommodationsGrid;
