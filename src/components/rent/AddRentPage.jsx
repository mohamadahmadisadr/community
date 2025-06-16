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
  Divider,
  Alert,
  Chip,
  Grid,
  InputAdornment
} from '@mui/material';
import { ArrowBack, Add, Remove } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddRentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    type: '',
    category: '',

    // Location Information
    address: '',
    city: '',
    province: '',
    postalCode: '',

    // Property Details
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: '',
    parking: '',
    petPolicy: '',
    smokingPolicy: '',

    // Pricing Information
    rent: '',
    currency: 'CAD',
    deposit: '',
    utilitiesIncluded: [],

    // Contact Information
    phone: '',
    email: '',
    preferredContact: '',

    // Features and Amenities
    features: [],
    amenities: [],

    // Availability
    availableFrom: '',
    leaseTerm: '',
    viewingSchedule: '',

    // Media
    images: [''],
    virtualTour: ''
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Predefined options based on database structure
  const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'basement', label: 'Basement' },
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'other', label: 'Other' }
  ];

  const RENTAL_CATEGORIES = [
    { value: 'long-term', label: 'Long-term (6+ months)' },
    { value: 'short-term', label: 'Short-term (1-6 months)' },
    { value: 'temporary', label: 'Temporary (Less than 1 month)' },
    { value: 'student-housing', label: 'Student Housing' },
    { value: 'shared-accommodation', label: 'Shared Accommodation' },
    { value: 'vacation-rental', label: 'Vacation Rental' }
  ];

  const FURNISHED_OPTIONS = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi-furnished', label: 'Semi-furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const LEASE_TERMS = [
    { value: 'month-to-month', label: 'Month-to-month' },
    { value: '3-months', label: '3 months' },
    { value: '6-months', label: '6 months' },
    { value: '1-year', label: '1 year' },
    { value: '2-years', label: '2 years' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'negotiable', label: 'Negotiable' }
  ];

  const CANADIAN_PROVINCES = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ];

  const CANADIAN_CITIES = [
    'Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Oshawa', 'Barrie',
    'Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Vancouver', 'Surrey', 'Burnaby',
    'Calgary', 'Edmonton', 'Red Deer', 'Winnipeg', 'Brandon', 'Saskatoon', 'Regina',
    'Halifax', 'Sydney', 'Saint John', 'Moncton', 'Fredericton', "St. John's", 'Charlottetown'
  ];

  const UTILITIES = [
    'electricity', 'gas', 'water', 'sewer', 'trash', 'internet', 'cable', 'phone', 'heating', 'air-conditioning'
  ];

  const PROPERTY_FEATURES = [
    'hardwood-floors', 'carpet', 'tile-floors', 'fireplace', 'walk-in-closet', 'storage-space',
    'high-ceilings', 'updated-kitchen', 'granite-counters', 'stainless-appliances', 'dishwasher',
    'washer-dryer-hookup', 'washer-dryer-included', 'air-conditioning', 'heating-included',
    'balcony', 'patio', 'garden-access', 'elevator', 'wheelchair-accessible', 'security-system',
    'intercom', 'concierge', 'doorman', 'internet-included', 'cable-included', 'utilities-included',
    'heat-included', 'hydro-included', 'water-included'
  ];

  const BUILDING_AMENITIES = [
    'gym', 'pool', 'sauna', 'hot-tub', 'rooftop-terrace', 'bbq-area', 'party-room',
    'meeting-room', 'business-center', 'library', 'playground', 'dog-park', 'bike-storage',
    'storage-lockers', 'visitor-parking', 'underground-parking', 'surface-parking',
    'car-wash', 'electric-car-charging', '24-hour-security', 'video-surveillance',
    'controlled-access', 'mail-room', 'package-receiving', 'dry-cleaning', 'on-site-management'
  ];

  const PARKING_OPTIONS = [
    { value: 'none', label: 'No Parking' },
    { value: 'street-parking', label: 'Street Parking' },
    { value: 'driveway', label: 'Driveway' },
    { value: 'garage', label: 'Garage' },
    { value: 'underground-garage', label: 'Underground Garage' },
    { value: 'surface-lot', label: 'Surface Lot' },
    { value: 'assigned-spot', label: 'Assigned Spot' },
    { value: 'visitor-parking', label: 'Visitor Parking' }
  ];

  const PET_POLICIES = [
    { value: 'no-pets', label: 'No Pets' },
    { value: 'cats-allowed', label: 'Cats Allowed' },
    { value: 'dogs-allowed', label: 'Dogs Allowed' },
    { value: 'small-pets-only', label: 'Small Pets Only' },
    { value: 'pets-negotiable', label: 'Pets Negotiable' },
    { value: 'pet-deposit-required', label: 'Pet Deposit Required' }
  ];

  const SMOKING_POLICIES = [
    { value: 'no-smoking', label: 'No Smoking' },
    { value: 'smoking-allowed', label: 'Smoking Allowed' },
    { value: 'outdoor-smoking-only', label: 'Outdoor Smoking Only' },
    { value: 'designated-smoking-areas', label: 'Designated Smoking Areas' }
  ];

  const CONTACT_METHODS = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'both', label: 'Both Phone and Email' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.title || formData.title.length < 3) {
      errors.push('Property title must be at least 3 characters long');
    }

    if (!formData.description || formData.description.length < 10) {
      errors.push('Property description must be at least 10 characters long');
    }

    if (!formData.type) {
      errors.push('Property type is required');
    }

    if (!formData.category) {
      errors.push('Rental category is required');
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

    if (!formData.bedrooms || formData.bedrooms < 0) {
      errors.push('Number of bedrooms is required and must be 0 or greater');
    }

    if (!formData.bathrooms || formData.bathrooms < 0) {
      errors.push('Number of bathrooms is required and must be 0 or greater');
    }

    if (!formData.area || formData.area <= 0) {
      errors.push('Area is required and must be greater than 0');
    }

    if (!formData.furnished) {
      errors.push('Furnished status is required');
    }

    if (!formData.rent || formData.rent <= 0) {
      errors.push('Rent amount is required and must be greater than 0');
    }

    if (!formData.availableFrom) {
      errors.push('Available from date is required');
    } else {
      const availableDate = new Date(formData.availableFrom);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (availableDate < oneYearAgo) {
        errors.push('Available from date cannot be more than 1 year in the past');
      }
    }

    if (!formData.leaseTerm) {
      errors.push('Lease term is required');
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // URL validation for images and virtual tour
    const urlPattern = /^https?:\/\/.+/;
    formData.images.forEach((image, index) => {
      if (image && !urlPattern.test(image)) {
        errors.push(`Image ${index + 1} must be a valid URL starting with http:// or https://`);
      }
    });

    if (formData.virtualTour && !urlPattern.test(formData.virtualTour)) {
      errors.push('Virtual tour must be a valid URL starting with http:// or https://');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Prepare the rental data according to RENT_DATABASE_STRUCTURE.md
      const rentalData = {
        // Basic Property Information
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,

        // Location Information
        location: {
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode || "",
          coordinates: null // Can be added later with geocoding
        },

        // Property Details
        propertyDetails: {
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          area: parseInt(formData.area),
          furnished: formData.furnished,
          parking: formData.parking || "",
          petPolicy: formData.petPolicy || "",
          smokingPolicy: formData.smokingPolicy || ""
        },

        // Pricing Information
        pricing: {
          rent: parseFloat(formData.rent),
          currency: formData.currency,
          deposit: formData.deposit ? parseFloat(formData.deposit) : 0,
          utilitiesIncluded: formData.utilitiesIncluded,
          additionalFees: [] // Can be expanded later
        },

        // Contact Information
        contactInfo: {
          phone: formData.phone || "",
          email: formData.email || "",
          preferredContact: formData.preferredContact || ""
        },

        // Features and Amenities
        features: formData.features,
        amenities: formData.amenities,

        // Availability
        availability: {
          availableFrom: new Date(formData.availableFrom),
          leaseTerm: formData.leaseTerm,
          viewingSchedule: formData.viewingSchedule || ""
        },

        // Media
        images: formData.images.filter(img => img.trim() !== ''),
        virtualTour: formData.virtualTour || "",

        // Status and Moderation
        status: "pending", // Requires admin approval
        featured: false,
        verified: false,

        // Analytics and Engagement
        views: 0,
        inquiries: 0,

        // User Information
        userId: "anonymous", // Will be updated when user auth is implemented

        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'rent'), rentalData);

      alert('Property listing submitted successfully! It will be visible after admin approval.');
      navigate('/rent');
    } catch (error) {
      console.error('Error adding rental property:', error);
      setErrors(['Failed to add property listing. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/rent')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Add Rental Property
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Error Messages */}
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Basic Information
                </Typography>

                <TextField
                fullWidth
                label="Property Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
                helperText="Minimum 3 characters"
                />

                <TextField
                fullWidth
                label="Property Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                required
                helperText="Minimum 10 characters"
                />

                <TextField
                select
                fullWidth
                required
                label="Property Type *"
                name="type"
                value={formData.type}
                onChange={handleChange}
                sx={{ mb: 2 }}
                >
                {PROPERTY_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                  {type.label}
                  </MenuItem>
                ))}
                </TextField>

                <TextField
                select
                fullWidth
                required
                label="Rental Category *"
                name="category"
                value={formData.category}
                onChange={handleChange}
                sx={{ mb: 2 }}
                >
                {RENTAL_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                  {category.label}
                  </MenuItem>
                ))}
                </TextField>

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
                />

          <TextField
            select
            fullWidth
            required
            label="City *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {CANADIAN_CITIES.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>

          <TextField
          select
          fullWidth
          required
          label="Province *"
          name="province"
          value={formData.province}
          onChange={handleChange}
          sx={{ mb: 2 }}
          >
          {CANADIAN_PROVINCES.map((province) => (
            <MenuItem key={province} value={province}>
            {province}
            </MenuItem>
          ))}
          </TextField>

          <TextField
          fullWidth
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          sx={{ mb: 2 }}
          helperText="Optional"
          />

                      <Divider sx={{ my: 3 }} />

                      {/* Property Details */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Property Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Bedrooms *"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Bathrooms *"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                fullWidth
                label="Area (sqft) *"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }} direction="column" display="flex" justifyContent="space-between" gap={2}>
            <TextField
                select
                fullWidth
                required
                label="Furnished Status *"
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
              >
                {FURNISHED_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Parking"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
              >
                {PARKING_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>



              <Box sx={{ mb: 3 }} direction="column" display="flex" justifyContent="space-between" gap={2}>
                <TextField
                select
                fullWidth
                label="Pet Policy"
                name="petPolicy"
                value={formData.petPolicy}
                onChange={handleChange}
              >
                {PET_POLICIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
                 <TextField
                select
                fullWidth
                label="Smoking Policy"
                name="smokingPolicy"
                value={formData.smokingPolicy}
                onChange={handleChange}
              >
                {SMOKING_POLICIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
                </Box>

          <Divider sx={{ my: 3 }} />

          {/* Pricing Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Pricing
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Rent *"
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Security Deposit"
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                helperText="Optional"
              />
            </Grid>
          </Grid>

          {/* Utilities Included */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Utilities Included
          </Typography>
          <Box sx={{ mb: 2 }}>
            {UTILITIES.map((utility) => (
              <Chip
                key={utility}
                label={utility.charAt(0).toUpperCase() + utility.slice(1).replace('-', ' ')}
                onClick={() => handleMultiSelectChange('utilitiesIncluded', utility)}
                color={formData.utilitiesIncluded.includes(utility) ? 'primary' : 'default'}
                variant={formData.utilitiesIncluded.includes(utility) ? 'filled' : 'outlined'}
                sx={{ m: 0.5, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Contact Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                helperText="Optional"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                helperText="Optional"
              />
            </Grid>
          </Grid>

          <TextField
            select
            fullWidth
            label="Preferred Contact Method"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >
            {CONTACT_METHODS.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Property Features
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Select applicable features
          </Typography>
          <Box sx={{ mb: 2 }}>
            {PROPERTY_FEATURES.map((feature) => (
              <Chip
                key={feature}
                label={feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                onClick={() => handleMultiSelectChange('features', feature)}
                color={formData.features.includes(feature) ? 'primary' : 'default'}
                variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                sx={{ m: 0.5, cursor: 'pointer' }}
              />
            ))}
          </Box>

          {/* Amenities */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Building Amenities
          </Typography>
          <Box sx={{ mb: 2 }}>
            {BUILDING_AMENITIES.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                onClick={() => handleMultiSelectChange('amenities', amenity)}
                color={formData.amenities.includes(amenity) ? 'secondary' : 'default'}
                variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                sx={{ m: 0.5, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Availability */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Availability
          </Typography>

          <Box sx={{ mb: 2 }} direction="column" display="flex" justifyContent="space-between" gap={2}>
             <TextField
                fullWidth
                label="Available From *"
                name="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
             
              <TextField
                select
                fullWidth
                required
                label="Lease Term *"
                name="leaseTerm"
                value={formData.leaseTerm}
                onChange={handleChange}
              >
                {LEASE_TERMS.map((term) => (
                  <MenuItem key={term.value} value={term.value}>
                    {term.label}
                  </MenuItem>
                ))}
              </TextField>
            
              </Box>

          <TextField
            fullWidth
            label="Viewing Schedule"
            name="viewingSchedule"
            value={formData.viewingSchedule}
            onChange={handleChange}
            sx={{ mb: 2 }}
            helperText="Optional - e.g., 'Weekends 10am-4pm, weekdays by appointment'"
          />

          <Divider sx={{ my: 3 }} />

          {/* Images */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Images
          </Typography>

          {formData.images.map((image, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`Image URL ${index + 1}`}
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                helperText="Enter a valid URL starting with http:// or https://"
              />
              {formData.images.length > 1 && (
                <IconButton
                  onClick={() => removeImageField(index)}
                  sx={{ ml: 1 }}
                  color="error"
                >
                  <Remove />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            startIcon={<Add />}
            onClick={addImageField}
            sx={{ mb: 2 }}
          >
            Add Another Image
          </Button>

          <TextField
            fullWidth
            label="Virtual Tour URL"
            name="virtualTour"
            value={formData.virtualTour}
            onChange={handleChange}
            sx={{ mb: 3 }}
            helperText="Optional - Enter a valid URL for virtual tour"
          />

          {/* Submit Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/rent')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Submitting...' : 'Submit Property'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRentPage;
