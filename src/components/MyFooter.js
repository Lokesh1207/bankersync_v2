// components/Footer.js
import React from "react";
import { Box, Typography } from "@mui/material";

const MyFooter = () => (
  <Box
    sx={{
      backgroundColor: "#f5f5f5", // Soft light grey
      color: "#555", // Slightly darker text for contrast
      py: 4,
      textAlign: "center",
      mt: 4,
    }}
  >
    <Typography variant="body2">
      © {new Date().getFullYear()} Banker Sync. All rights reserved.
    </Typography>
  </Box>
);

export default MyFooter;
