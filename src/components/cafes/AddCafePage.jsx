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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddCafePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialty: '',
    address: '',
    city: '',
    phone: '',
    hours: '',
    priceRange: '',
    rating: '',
    image: '',
    website: '',
    hasWifi: false,
    hasOutdoorSeating: false,
    hasParking: false,
    petFriendly: false,
  });
  const [loading, setLoading] = useState(false);

  const specialties = [
    'Coffee',
    'Tea',
    'Persian Tea',
    'Pastries',
    'Desserts',
    'Light Meals',
    'Breakfast',
    'Hookah',
    'Study Space',
    'Other',
  ];

  const priceRanges = [
    '$',
    '$$',
    '$$$',
    '$$$$',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);

    try {
      const imageUrl = formData.image || 'https://placehold.co/400x300/1976d2/white?text=Cafe';

      await addDoc(collection(db, 'cafes'), {
        name: formData.name,
        description: formData.description || "",
        specialty: formData.specialty || "Coffee",
        category: "Cafe",
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
        features: {
          hasWifi: formData.hasWifi || false,
          hasOutdoorSeating: formData.hasOutdoorSeating || false,
          hasParking: formData.hasParking || false,
          petFriendly: formData.petFriendly || false,
          hasDelivery: false,
          hasTakeout: true
        },
        amenities: [
          ...(formData.hasWifi ? ["free-wifi"] : []),
          ...(formData.hasOutdoorSeating ? ["outdoor-seating"] : []),
          ...(formData.hasParking ? ["parking"] : []),
          ...(formData.petFriendly ? ["pet-friendly"] : [])
        ],
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

      alert('Café submitted successfully! It will be visible after admin approval.');
      navigate('/cafes');
    } catch (error) {
      console.error('Error adding café:', error);
      alert('Failed to add café. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/cafes')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Add New Café
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Café Name *"
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
            <InputLabel>Specialty</InputLabel>
            <Select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              label="Specialty"
            >
              {specialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
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
            placeholder="e.g., Mon-Sun 7AM-9PM"
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
            sx={{ mb: 2 }}
            placeholder="https://example.com/image.jpg"
          />

          {/* Features */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Features
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasWifi}
                  onChange={handleChange}
                  name="hasWifi"
                />
              }
              label="Free WiFi"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasOutdoorSeating}
                  onChange={handleChange}
                  name="hasOutdoorSeating"
                />
              }
              label="Outdoor Seating"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasParking}
                  onChange={handleChange}
                  name="hasParking"
                />
              }
              label="Parking Available"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.petFriendly}
                  onChange={handleChange}
                  name="petFriendly"
                />
              }
              label="Pet Friendly"
            />
          </Box>

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
            {loading ? 'Adding Café...' : 'Add Café'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddCafePage;
