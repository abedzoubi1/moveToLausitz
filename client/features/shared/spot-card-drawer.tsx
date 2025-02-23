"use client";
import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  Link,
  Drawer,
  Button,
} from "@mui/material";
import {
  Favorite,
  ArrowBack,
  Schedule,
  LocationOn,
  Phone,
  Language,
  Email,
  DirectionsWalk as DirectionsWalkIcon,
} from "@mui/icons-material";
import { ImageSlider } from "./ImageSlider";
import { ReadMoreText } from "./ReadMore";
import { OpeningHours } from "./oppeningHouers";
import { cultureSpot } from "../culture/pages/types";
import { parseSchedule } from "./func";
import { useRouter } from "next/navigation";
import { useFilter } from "@/context/FilterContext";

interface ColtureSpotDrawerProps {
  open: boolean;
  onClose: () => void;
  item: cultureSpot;
  images: string[];
  currentCoords: { lat: number; lon: number };
}

export const SpotDrawer = ({
  open,
  onClose,
  item,
  images,
  currentCoords,
}: ColtureSpotDrawerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { filterState } = useFilter();

  const navigationHref = `/navigation?currentLat=${filterState!.location?.lat}&currentLon=${filterState!.location?.lng}&goalLat=${item.latitude}&goalLon=${item.longitude}`;
  const router = useRouter(); // initialize router from next/navigation

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 450 } } }}
    >
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton onClick={onClose}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setIsFavorite(!isFavorite)}>
            <Favorite
              sx={{ color: isFavorite ? "error.main" : "action.active" }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ImageSlider images={images} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {item.name}
        </Typography>

        {/* Description */}
        <ReadMoreText text={item.description || ""} maxLines={4} />

        {/* Details List */}
        <List>
          <Divider component="li" />
          {/* Opening Hours */}
          {item.opening_hours && (
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Schedule />
              </ListItemIcon>
              <ListItemText
                primary="Öffnungszeiten"
                secondary={<OpeningHours opening_hours={item.opening_hours} />}
              />
              <Divider component="li" />
            </ListItem>
          )}
          {/* scheduale*/}
          {item.schedule && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Schedule />
                </ListItemIcon>
                <ListItemText
                  primary="Zeitplan"
                  secondary={parseSchedule(item.schedule).map(
                    (entry, index) => (
                      <Typography key={index} variant="body2" paragraph>
                        {entry}
                      </Typography>
                    )
                  )}
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* Address */}
          {item.address && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Adresse"
                  secondary={
                    <Link
                      href={`https://maps.google.com?q=${item.address + " " + item.postal_code + " " + item.locality}`}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {item.address}, {item.postal_code} {item.locality}
                    </Link>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* Distance */}
          {item.distance && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Entfernung"
                  secondary={`${item.distance}`}
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* type of trail */}
          {item.type_of_trail && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DirectionsWalkIcon />
                </ListItemIcon>
                <ListItemText primary="Typ" secondary={item.type_of_trail} />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* Phone */}
          {item.telephone && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="Telefon"
                  secondary={
                    <Link
                      href={`tel:${item.telephone}`}
                      sx={{ textDecoration: "none" }}
                    >
                      {item.telephone}
                    </Link>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* Email */}
          {item.email && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={
                    <Link
                      href={`mailto:${item.email}`}
                      sx={{ textDecoration: "none" }}
                    >
                      {item.email}
                    </Link>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          )}
          {/* Website */}
          {item.url && (
            <>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Language />
                </ListItemIcon>
                <ListItemText
                  primary="Website"
                  secondary={
                    <Link href={item.url} target="_blank" rel="noopener">
                      {item.url}
                    </Link>
                  }
                />
              </ListItem>
              <Divider />
            </>
          )}
        </List>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Button
          variant="contained"
          onClick={() => router.push(navigationHref)}
          sx={{
            bgcolor: "rgb(145, 193, 84)",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            py: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              bgcolor: "rgb(130, 173, 77)",
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          Anreise
        </Button>
      </Box>
    </Drawer>
  );
};
