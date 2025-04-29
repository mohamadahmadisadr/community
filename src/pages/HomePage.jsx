import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
} from "@mui/material";
import Header from "../pages/MyHeader";
import Footer from "../pages/MyFooter";
import EllipsisTypography from "../pages/custom/EllipsisTypography";
import { useNavigate } from "react-router-dom";

const HomePage = ({ jobs, searchQuery, onSearch }) => {
  const navigate = useNavigate();

  const handleViewDetails = (job) => {
    navigate(`/job/${job.id}`);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to determine text direction and font
  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "rtl" : "ltr";
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  return (
    <>
      <Header />
      <Container
        sx={{
          mt: 10,
          mb: 8,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: "bold", textAlign: "start" }}
        >
          Explore Exciting Job Opportunities
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by title or city"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Grid container spacing={4}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  maxWidth: 345,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Chip
                    label={job.city}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      backgroundColor: "primary.main",
                      color: "white",
                    }}
                  />
                  <CardMedia
                    component="img"
                    height="200"
                    image={job.image}
                    alt={job.title}
                  />
                </Box>
                <CardContent>
                  <EllipsisTypography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(job.title), // Apply dynamic font
                    }}
                    lines={1}
                  >
                    {job.title}
                  </EllipsisTypography>
                  <EllipsisTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(job.description), // Apply dynamic font
                    }}
                    lines={3}
                  >
                    {job.description}
                  </EllipsisTypography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: "end" }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleViewDetails(job)}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;