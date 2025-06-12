import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { authData, isAuthenticated, login, logOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = () => {
    if (isAuthenticated) {
      logOut();
    } else {
      navigate("/login");
    }
  };

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            color: theme.palette.primary.contrastText,
          }}
          textAlign={"start"}
          onClick={handleNavigation("/")}
        >
          Job Portal
        </Typography>

        <Box>
          <Button
            color="inherit"
            sx={{ textTransform: "none", mx: 1 }}
            onClick={handleNavigation("/addJob")}
          >
            Add Job
          </Button>
          <Button
            color="inherit"
            sx={{ textTransform: "none", mx: 1 }}
            onClick={handleNavigation("/about")}
          >
            About
          </Button>
          <Button
            color="inherit"
            sx={{ textTransform: "none", mx: 1 }}
            onClick={handleLogin}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;