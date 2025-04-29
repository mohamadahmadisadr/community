import React from "react";
import { Typography } from "@mui/material";

const EllipsisTypography = ({ children, lines = 2, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        display: "-webkit-box",
        overflow: "hidden",
        textOverflow: "ellipsis",
        WebkitLineClamp: lines, // Use the `lines` prop to control the number of lines
        WebkitBoxOrient: "vertical",
        ...props.sx, // Allow additional styles to be passed
      }}
    >
      {children}
    </Typography>
  );
};

export default EllipsisTypography;