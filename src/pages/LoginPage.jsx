import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import Header from "./MyHeader";
import Footer from "./MyFooter";
import { GoogleLogin, googleLogout } from '@react-oauth/google';

const LoginPage = (props) => {



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
          Sign in
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GoogleLogin
          onSuccess={props.handleGoogleLogin}
          onError={() => {
            // Handle login failure silently
          }}/>
          </div>

      </Container>
      <Footer />
    </>
  );
};

export default LoginPage;