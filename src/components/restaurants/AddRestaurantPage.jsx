import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddRestaurantPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    city: '',
    phone: '',
    hours: '',
    priceRange: '',
    rating: '',
    image: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);

  const cuisineTypes = [
    'Persian',
    'Middle Eastern',
    'Mediterranean',
    'Turkish',
    'Lebanese',
    'Afghan',
    'International',
    'Fast Food',
    'Vegetarian',
    'Halal',
    'Other',
  ];

  const priceRanges = [
    '$',
    '$$',
    '$$$',
    '$$$$',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);

    try {
      const imageUrl = formData.image || 'https://placehold.co/400x300/1976d2/white?text=Restaurant';

      await addDoc(collection(db, 'restaurants'), {
        name: formData.name,
        description: formData.description || "",
        cuisine: formData.cuisine || "Persian",
        category: "Restaurant",
        location: {
          address: formData.address,
          city: formData.city,
          province: "",
          postalCode: "",
          coordinates: {
            lat: null,
            lng: null
          }
        },
        contact: {
          phone: formData.phone || "",
          email: "",
          website: formData.website || ""
        },
        hours: {
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: ""
        },
        priceRange: formData.priceRange || "$$",
        rating: parseFloat(formData.rating) || 0,
        reviewCount: 0,
        features: ["dine-in"],
        paymentMethods: ["cash", "card"],
        image: imageUrl,
        images: [],
        menu: "",
        status: "pending", // Requires admin approval
        verified: false,
        featured: false,
        views: 0,
        postedBy: "anonymous", // Will be updated when user auth is implemented
        approvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      alert('Restaurant submitted successfully! It will be visible after admin approval.');
      navigate('/restaurants');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Failed to add restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/restaurants')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Add New Restaurant
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Restaurant Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              label="Cuisine Type"
            >
              {cuisineTypes.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Address *"
            name="address"
            value={formData.address}
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
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="(xxx) xxx-xxxx"
          />

          <TextField
            fullWidth
            label="Hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="e.g., Mon-Sun 11AM-10PM"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Price Range</InputLabel>
            <Select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              label="Price Range"
            >
              {priceRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Rating (1-5)"
            name="rating"
            type="number"
            inputProps={{ min: 1, max: 5, step: 0.1 }}
            value={formData.rating}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="https://example.com"
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
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            {loading ? 'Adding Restaurant...' : 'Add Restaurant'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRestaurantPage;
