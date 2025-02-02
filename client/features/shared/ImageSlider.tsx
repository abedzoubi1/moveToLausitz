"use client";
import { useState, useRef, useEffect } from "react";
import { Box, IconButton, Stack, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface ImageSliderProps {
  images: string[];
  height?: number;
}

export const ImageSlider = ({ images, height = 300 }: ImageSliderProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayImages =
    images?.length > 0 ? images : ["/images/defult_image.jpg"]; // Update path to use public folder

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, images.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = activeStep * container.clientWidth;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeStep]);

  return (
    <Box sx={{ position: "relative", height }}>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          height,
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Slide ${index + 1}`}
            sx={{
              flex: "0 0 100%",
              width: "100%",
              height,
              objectFit: "cover",
              scrollSnapAlign: "start",
            }}
          />
        ))}
      </Box>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              visibility: activeStep > 0 ? "visible" : "hidden",
            }}
            onClick={handleBack}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              visibility: activeStep < images.length - 1 ? "visible" : "hidden",
            }}
            onClick={handleNext}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {displayImages.map((_, index) => (
            <Chip
              key={index}
              size="small"
              sx={{
                bgcolor:
                  activeStep === index
                    ? "primary.main"
                    : "rgba(255,255,255,0.5)",
                width: 8,
                height: 8,
                p: 0,
                "& .MuiChip-label": { display: "none" },
                cursor: "pointer",
              }}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};
