"use client";
import { Key, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ImageList,
  ImageListItem,
  AppBar,
  Toolbar,
  Link,
  Drawer,
} from "@mui/material";
import {
  Favorite,
  ArrowBack,
  Schedule,
  LocationOn,
  Phone,
  Language,
  Email,
} from "@mui/icons-material";
import { TouristInfoCenter } from "./types";
import { ImageSlider } from "./ImageSlider";
import { ReadMoreText } from "./ReadMore";
import { OpeningHours } from "./oppeningHouers";
interface TouristInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  item: TouristInfoCenter;
  images: string[];
}

export const TouristInfoDrawer = ({
  open,
  onClose,
  item,
  images,
}: TouristInfoDrawerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

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
          {" "}
          <Divider component="li" />
          <ListItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Schedule />
            </ListItemIcon>
            <ListItemText
              primary="Öffnungszeiten"
              secondary={<OpeningHours opening_hours={item.opening_hours} />}
            />
          </ListItem>
          <Divider component="li" />
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
              <Divider />
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
                  primary="E-Mail"
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
              <Divider />
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
    </Drawer>
  );
};
