import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Header from "./MyHeader";
import Footer from "./MyFooter";

const AboutPage = () => {
  return (
    <>
      <Header />
      <Container
        sx={{
          mt: 10,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          textAlign: "start",
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            p: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 4,
              color: "primary.main",
                textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: "2.5rem",
            fontFamily: "monospace",
            stroke: "black",
            strokeWidth: 1,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            Empowering the Iranian Community
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              color: "text.primary",
            }}
          >
            Our mission is to help the Iranian community by providing a platform
            that connects individuals with opportunities and resources. We are
            dedicated to fostering growth, collaboration, and support within
            the community.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              color: "text.primary",
            }}
          >
            This website is constantly improving to better serve the needs of
            our users. We are working hard to add new features and enhance the
            user experience. Your support and feedback are invaluable to us as
            we continue to grow and develop.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: "text.primary",
            }}
          >
            Thank you for being a part of our journey. Together, we can make a
            difference in the Iranian community.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;