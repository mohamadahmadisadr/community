import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import Header from "./MyHeader";
import Footer from "./MyFooter";

const RegisterPage = () => {
  const handleGoogleRegister = () => {
    console.log("Google register clicked");
  };

  const handleNavigateToLogin = () => {
    console.log("Navigate to login page");
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 10,
          mb: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Register
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleRegister}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderColor: "primary.main",
            color: "primary.main",
            mb: 2,
          }}
        >
          Register with Google
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Already have an account?
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleNavigateToLogin}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default RegisterPage;