import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust the path to your Firebase config file
import Header from "../pages/MyHeader";
import Footer from "../pages/MyFooter";

const AddJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    province: "",
    city: "",
    link: "",
    image: "", // New field for image URL
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !formData.title ||
      !formData.description ||
      !formData.country ||
      !formData.province ||
      !formData.city
    ) {
      alert("All required fields must be filled!");
      return;
    }

    setLoading(true);

    try {
      // Use placeholder image if no image URL is provided
      const imageUrl = formData.image || "https://placehold.co/400";

      // Add job to Firestore
      await addDoc(collection(db, "jobs"), {
        ...formData,
        image: imageUrl,
      });

      alert("Job added successfully!");
      setFormData({
        title: "",
        description: "",
        country: "",
        province: "",
        city: "",
        link: "",
        image: "",
      });
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="sm"
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
          Add a Job
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            fullWidth
            label="Link to Apply (Optional)"
            name="link"
            value={formData.link}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Image URL (Optional)"
            name="image"
            value={formData.image}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {loading ? "Submitting..." : "Submit Job"}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AddJobPage;