import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    province: "",
    city: "",
    link: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const imageUrl = formData.image || "https://placehold.co/400x300/1976d2/white?text=Job";

      await addDoc(collection(db, "jobs"), {
        title: formData.title,
        description: formData.description,
        location: {
          city: formData.city,
          province: formData.province,
          country: formData.country,
          address: "" // Can be added later via admin panel
        },
        company: "", // Can be added later via admin panel
        salary: {
          min: null,
          max: null,
          currency: "CAD",
          type: "annual"
        },
        jobType: "full-time", // Default value
        category: "General", // Default category
        requirements: [],
        benefits: [],
        contactEmail: "",
        contactPhone: "",
        applicationLink: formData.link || "",
        image: imageUrl,
        status: "pending", // Requires admin approval
        featured: false,
        views: 0,
        applications: 0,
        expiryDate: null,
        postedBy: "anonymous", // Will be updated when user auth is implemented
        approvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      alert("Job submitted successfully! It will be visible after admin approval.");
      navigate('/jobs');
    } catch (error) {
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/jobs')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Post New Job
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Job Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Job Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Country *"
            name="country"
            value={formData.country}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Province *"
            name="province"
            value={formData.province}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="City *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Application Link (Optional)"
            name="link"
            value={formData.link}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="https://example.com/apply"
          />

          <TextField
            fullWidth
            label="Image URL (Optional)"
            name="image"
            value={formData.image}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://example.com/image.jpg"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {loading ? "Posting Job..." : "Post Job"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddJobPage;