import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 2,
        textAlign: "center",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 Job Portal. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;