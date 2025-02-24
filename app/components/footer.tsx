// app/components/Footer.tsx (client component)
"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import LockOutlined from "@mui/icons-material/LockOutlined";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

export default function Footer() {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "rgb(40,121,169)", // or your dark color
        color: "#ffffff",
        py: 3,
        mt: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Left side: copyright */}
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            © movetolausitz.de
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            Alle Rechte vorbehalten.
          </Typography>
        </Box>

        {/* Middle: Impressum / Datenschutz */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: { xs: 2, md: 0 } }}
        >
          <LockOutlined fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            <Link
              href="/impressum"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              IMPRESSUM
            </Link>
          </Typography>
        </Stack>

        {/* Right side: Scroll-to-top button */}
        <IconButton
          onClick={scrollToTop}
          sx={{
            color: "white",
            border: "2px solid #white",
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUp />
        </IconButton>
      </Container>
    </Box>
  );
}
