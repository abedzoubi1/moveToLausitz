import React, { useState, useEffect, use } from "react";
import { Container, Grid, Box } from "@mui/material";
import { SpotCard } from "../../shared/spot-card";
import { Event } from "./types";
import { getEvents } from "../api/get-events";
import { MapView } from "@/features/shared/map";
import { useFilter } from "@/context/FilterContext";

interface EventGridProps {
  isMapView: boolean;
}

const EventsG = ({ event }: { event: Event[] }) => {
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
          {event.map((event, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <SpotCard
                type_of_trail={undefined}
                distance={undefined}
                email={undefined}
                opening_hours={""}
                {...event}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export const EventGrid = ({ isMapView }: EventGridProps) => {
  const [centers, setSpots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filterState } = useFilter();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getEvents(
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
  }, [filterState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return isMapView ? (
    <MapView category="events" entities={centers} />
  ) : (
    <EventsG event={centers} />
  );
};

export default EventGrid;
