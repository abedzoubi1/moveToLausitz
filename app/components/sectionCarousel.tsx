"use client";
import { useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import Link from "next/link";
import { Item } from "../types";

interface CarouselSectionProps {
  title: string;
  items: Item[];
  table: string;
}

export default function CarouselSection({
  title,
  items,
  table,
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative", my: 4, px: { xs: 2, md: 6 } }}>
      {/* Title with green line */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 100,
            height: 4,
            bgcolor: "rgb(145, 193, 84)",
          }}
        />
        <Typography variant="h4" sx={{ pt: 2, fontWeight: "bold" }}>
          {title}
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <IconButton
        onClick={() => scroll(-1)}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "background.paper",
          boxShadow: 2,
          zIndex: 2,
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <NavigateBefore />
      </IconButton>

      <IconButton
        onClick={() => scroll(1)}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "background.paper",
          boxShadow: 2,
          zIndex: 2,
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <NavigateNext />
      </IconButton>

      {/* Cards Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          px: { xs: 0, md: 8 },
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              flexShrink: 0,
              width: {
                xs: "85%",
                sm: "calc(50% - 16px)",
                md: "calc(33.333% - 16px)",
                lg: "calc(25% - 16px)",
              },
              scrollSnapAlign: "start",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Link key={item.id} href={`/category/${table}`} passHref>
              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  objectFit: "cover",
                  aspectRatio: "16/9",
                  backgroundColor: "grey.100",
                }}
                image={item.image}
                alt={item.title}
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
                  {item.title}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        ))}
      </Box>

      {/* Show More Link */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Link href={`/category/${table}`} passHref>
          <Typography
            component="button"
            sx={{
              px: 4,
              py: 2,
              bgcolor: "background.paper",
              border: 2,
              borderColor: "grey.200",
              borderRadius: 2,
              fontWeight: 600,
              color: "text.primary",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "grey.50",
                borderColor: "grey.300",
              },
            }}
          >
            Entdecken Sie mehr
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
