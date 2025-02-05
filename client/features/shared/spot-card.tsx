"use client";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { cultureSpot } from "../culture/pages/types";
import { SpotDrawer } from "./spot-card-drawer";
import React from "react";
import { convertImageUrlsString } from "./func";

export const SpotCard = (item: cultureSpot) => {
  const imageUrls = convertImageUrlsString(
    Array.isArray(item.images) ? JSON.stringify(item.images) : item.images
  );

  const [open, setOpen] = React.useState(false);
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={() => setOpen(true)}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: "cover",
          aspectRatio: "16/9",
          backgroundColor: "grey.100",
        }}
        image={imageUrls[0] ? imageUrls[0] : "/images/defult_image.jpg"}
        alt={item.name ?? "Tourist Location"}
        loading="lazy"
      />
      <CardContent sx={{ height: 80, overflow: "hidden" }}>
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.2,
          }}
        >
          {item.name ?? "Tourist Location"}
        </Typography>
      </CardContent>
      <SpotDrawer
        open={open}
        onClose={(e?: React.MouseEvent) => {
          e?.stopPropagation();
          setOpen(false);
        }}
        item={item}
        images={imageUrls}
      />
    </Card>
  );
};
