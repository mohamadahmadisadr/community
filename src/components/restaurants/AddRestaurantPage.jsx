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
  Divider,
  Alert,
  Chip
} from '@mui/material';
import { ArrowBack, Add, Remove } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddRestaurantPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    cuisine: '',
    category: '',

    // Location Information
    address: '',
    city: '',
    province: '',
    postalCode: '',

    // Contact Information
    phone: '',
    email: '',
    website: '',

    // Business Information
    priceRange: '',
    features: [],
    paymentMethods: [],

    // Hours (simplified for form)
    mondayHours: '',
    tuesdayHours: '',
    wednesdayHours: '',
    thursdayHours: '',
    fridayHours: '',
    saturdayHours: '',
    sundayHours: '',

    // Optional fields
    image: '',
    menuUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');

  // From RESTAURANTS_DATABASE_STRUCTURE.md
  const cuisineTypes = [
    'Persian',
    'Middle Eastern',
    'Mediterranean',
    'Turkish',
    'Lebanese',
    'Afghan',
    'Pakistani',
    'Indian',
    'International',
    'Fast Food',
    'Vegetarian',
    'Vegan',
    'Halal',
    'Other'
  ];

  const categories = [
    'Restaurant',
    'Fast Food',
    'Cafe Restaurant',
    'Fine Dining',
    'Casual Dining',
    'Food Truck',
    'Catering',
    'Bakery Restaurant'
  ];

  const cities = [
    'Toronto',
    'Montreal',
    'Vancouver',
    'Calgary',
    'Edmonton',
    'Ottawa',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Kitchener',
    'London',
    'Victoria',
    'Halifax',
    'Oshawa',
    'Windsor',
    'Saskatoon',
    'Regina',
    'Sherbrooke',
    'St. Johns',
    'Barrie'
  ];

  const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon'
  ];

  const priceRanges = [
    '$',
    '$$',
    '$$$',
    '$$$$'
  ];

  const availableFeatures = [
    'dine-in',
    'takeout',
    'delivery',
    'outdoor-seating',
    'parking',
    'wheelchair-accessible',
    'wifi',
    'family-friendly',
    'halal',
    'vegetarian-options',
    'vegan-options',
    'alcohol-served',
    'reservations',
    'live-music',
    'catering'
  ];

  const availablePaymentMethods = [
    'cash',
    'credit-card',
    'debit-card',
    'mobile-payment',
    'contactless'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'features') {
        setFormData(prev => ({
          ...prev,
          features: checked
            ? [...prev.features, value]
            : prev.features.filter(f => f !== value)
        }));
      } else if (name === 'paymentMethods') {
        setFormData(prev => ({
          ...prev,
          paymentMethods: checked
            ? [...prev.paymentMethods, value]
            : prev.paymentMethods.filter(p => p !== value)
        }));
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCustomFeature = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()]
      });
      setCurrentFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.name || formData.name.length < 3) {
      errors.push('Restaurant name must be at least 3 characters long');
    }

    if (!formData.description || formData.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!formData.cuisine) {
      errors.push('Cuisine type is required');
    }

    if (!formData.category) {
      errors.push('Category is required');
    }

    if (!formData.address) {
      errors.push('Address is required');
    }

    if (!formData.city) {
      errors.push('City is required');
    }

    if (!formData.province) {
      errors.push('Province is required');
    }

    if (!formData.priceRange) {
      errors.push('Price range is required');
    }

    // Optional validations
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (formData.website) {
      try {
        new URL(formData.website);
      } catch {
        errors.push('Please enter a valid website URL');
      }
    }

    if (formData.menuUrl) {
      try {
        new URL(formData.menuUrl);
      } catch {
        errors.push('Please enter a valid menu URL');
      }
    }

    // Validate hours format
    const hourFields = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'];
    hourFields.forEach(field => {
      if (formData[field] && formData[field] !== 'Closed') {
        const hourRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!hourRegex.test(formData[field])) {
          errors.push(`${field.replace('Hours', '')} hours must be in format "HH:MM-HH:MM" or "Closed"`);
        }
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      // Prepare the restaurant data according to RESTAURANTS_DATABASE_STRUCTURE.md
      const restaurantData = {
        // Basic Information
        name: formData.name,
        description: formData.description,
        cuisine: formData.cuisine,
        category: formData.category,

        // Location Information
        location: {
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode || "",
          coordinates: {
            lat: null,
            lng: null
          }
        },

        // Contact Information
        contactInfo: {
          phone: formData.phone || "",
          email: formData.email || "",
          website: formData.website || ""
        },

        // Business Information
        priceRange: formData.priceRange,
        features: formData.features.length > 0 ? formData.features : ["dine-in"],
        paymentMethods: formData.paymentMethods.length > 0 ? formData.paymentMethods : ["cash", "credit-card"],

        // Hours
        hours: {
          monday: formData.mondayHours || "Closed",
          tuesday: formData.tuesdayHours || "Closed",
          wednesday: formData.wednesdayHours || "Closed",
          thursday: formData.thursdayHours || "Closed",
          friday: formData.fridayHours || "Closed",
          saturday: formData.saturdayHours || "Closed",
          sunday: formData.sundayHours || "Closed"
        },

        // Optional Information
        rating: 0, // Default rating
        reviewCount: 0,
        menuUrl: formData.menuUrl || "",

        // Status and Settings
        status: "pending", // Requires admin approval
        verified: false,
        featured: false,

        // Metadata
        userId: "anonymous", // Will be updated when user auth is implemented
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add image if provided
      if (formData.image) {
        restaurantData.image = formData.image;
      }

      await addDoc(collection(db, 'restaurants'), restaurantData);

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
    <Container maxWidth="md" sx={{ pt: 2, pb: 2 }}>
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
          {/* Basic Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Basic Information
          </Typography>

          <TextField
            fullWidth
            label="Restaurant Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 3 characters"
          />

          <TextField
            fullWidth
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 10 characters"
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Cuisine Type *</InputLabel>
              <Select
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                label="Cuisine Type *"
              >
                {cuisineTypes.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Category *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category *"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Location Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Location
          </Typography>

          <TextField
            fullWidth
            label="Street Address *"
            name="address"
            value={formData.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            placeholder="e.g., 123 Main Street"
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>City *</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="City *"
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Province *</InputLabel>
              <Select
                name="province"
                value={formData.province}
                onChange={handleChange}
                label="Province *"
              >
                {provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="A1A 1A1"
            helperText="Optional"
          />

          <Divider sx={{ my: 3 }} />

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Contact Information
          </Typography>

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="+1-416-555-0123"
            helperText="Optional - Phone is not required for restaurants"
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="info@restaurant.com"
            helperText="Optional"
          />

          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://restaurant.com"
            helperText="Optional"
          />

          <Divider sx={{ my: 3 }} />

          {/* Business Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Business Information
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Price Range *</InputLabel>
            <Select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              label="Price Range *"
            >
              {priceRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range} - {range === '$' ? 'Budget-friendly' :
                           range === '$$' ? 'Moderate' :
                           range === '$$$' ? 'Expensive' : 'Very Expensive'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Menu URL"
            name="menuUrl"
            value={formData.menuUrl}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://restaurant.com/menu"
            helperText="Optional - Link to online menu"
          />

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Restaurant Features
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Select all features that apply:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableFeatures.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      name="features"
                      value={feature}
                      checked={formData.features.includes(feature)}
                      onChange={handleChange}
                      size="small"
                    />
                  }
                  label={feature.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  sx={{
                    mr: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Payment Methods */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Payment Methods
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Select accepted payment methods:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availablePaymentMethods.map((method) => (
                <FormControlLabel
                  key={method}
                  control={
                    <Checkbox
                      name="paymentMethods"
                      value={method}
                      checked={formData.paymentMethods.includes(method)}
                      onChange={handleChange}
                      size="small"
                    />
                  }
                  label={method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  sx={{
                    mr: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Hours */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Operating Hours
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Enter hours in 24-hour format (e.g., "11:00-22:00") or "Closed"
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 3 }}>
            {[
              { key: 'mondayHours', label: 'Monday' },
              { key: 'tuesdayHours', label: 'Tuesday' },
              { key: 'wednesdayHours', label: 'Wednesday' },
              { key: 'thursdayHours', label: 'Thursday' },
              { key: 'fridayHours', label: 'Friday' },
              { key: 'saturdayHours', label: 'Saturday' },
              { key: 'sundayHours', label: 'Sunday' }
            ].map(({ key, label }) => (
              <TextField
                key={key}
                label={label}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder="11:00-22:00 or Closed"
                helperText="Optional"
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Optional Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Additional Information
          </Typography>

          <TextField
            fullWidth
            label="Restaurant Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://example.com/restaurant-image.jpg"
            helperText="Optional - URL to restaurant photo"
          />

          <Alert severity="info" sx={{ mb: 3 }}>
            Your restaurant will be submitted for review and will be visible to the public once approved by an administrator.
          </Alert>

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
            {loading ? 'Adding Restaurant...' : 'Submit Restaurant for Review'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRestaurantPage;
