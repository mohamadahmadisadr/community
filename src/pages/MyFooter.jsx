import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        py: 2,
        textAlign: "center",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Typography variant="body2" color="inherit">
        © 2025 Job Portal. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;