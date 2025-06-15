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
  Switch,
  Divider,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Event Information
    title: '',
    description: '',
    organizer: '',
    category: '',

    // Date and Time
    eventDate: '',
    endDate: '',
    eventTime: '',
    endTime: '',

    // Location Information
    isOnline: false,
    venue: '',
    address: '',
    city: '',
    province: '',
    onlineLink: '',

    // Pricing and Capacity
    ticketPrice: '',
    maxAttendees: '',

    // Contact Information
    contactEmail: '',
    contactPhone: '',
    registrationUrl: '',

    // Optional fields
    image: '',
  });
  const [loading, setLoading] = useState(false);

  // From EVENT_DATABASE_STRUCTURE.md
  const eventCategories = [
    'Cultural',
    'Educational',
    'Social',
    'Religious',
    'Business',
    'Sports',
    'Arts',
    'Music',
    'Food',
    'Community Service',
    'Other',
  ];

  const cities = [
    'Toronto',
    'Vancouver',
    'Montreal',
    'Calgary',
    'Ottawa',
    'Edmonton',
    'Mississauga',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Other'
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.title || formData.title.length < 3) {
      errors.push('Event title must be at least 3 characters long');
    }

    if (!formData.description || formData.description.length < 10) {
      errors.push('Event description must be at least 10 characters long');
    }

    if (!formData.organizer) {
      errors.push('Organizer name is required');
    }

    if (!formData.category) {
      errors.push('Event category is required');
    }

    if (!formData.eventDate) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        errors.push('Event date cannot be in the past');
      }
    }

    if (!formData.eventTime) {
      errors.push('Event time is required');
    }

    if (!formData.contactEmail) {
      errors.push('Contact email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Location validation
    if (formData.isOnline) {
      if (!formData.onlineLink) {
        errors.push('Online link is required for online events');
      } else {
        try {
          new URL(formData.onlineLink);
        } catch {
          errors.push('Please enter a valid URL for online link');
        }
      }
    } else {
      if (!formData.venue) {
        errors.push('Venue name is required for in-person events');
      }
      if (!formData.address) {
        errors.push('Address is required for in-person events');
      }
      if (!formData.city) {
        errors.push('City is required for in-person events');
      }
      if (!formData.province) {
        errors.push('Province is required for in-person events');
      }
    }

    // Optional validations
    if (formData.endDate && formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const endDate = new Date(formData.endDate);
      if (endDate < eventDate) {
        errors.push('End date must be after event date');
      }
    }

    if (formData.ticketPrice && isNaN(formData.ticketPrice)) {
      errors.push('Ticket price must be a valid number');
    }

    if (formData.maxAttendees && (isNaN(formData.maxAttendees) || formData.maxAttendees <= 0)) {
      errors.push('Maximum attendees must be a positive number');
    }

    if (formData.registrationUrl) {
      try {
        new URL(formData.registrationUrl);
      } catch {
        errors.push('Please enter a valid URL for registration link');
      }
    }

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
      // Prepare the event data according to EVENT_DATABASE_STRUCTURE.md
      const eventData = {
        // Basic Event Information
        title: formData.title,
        description: formData.description,
        organizer: formData.organizer,
        category: formData.category,

        // Date and Time
        eventDate: new Date(formData.eventDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        eventTime: formData.eventTime,
        endTime: formData.endTime || null,

        // Location Information
        location: {
          isOnline: formData.isOnline,
          venue: formData.isOnline ? "" : formData.venue,
          address: formData.isOnline ? "" : formData.address,
          city: formData.isOnline ? "" : formData.city,
          province: formData.isOnline ? "" : formData.province,
          onlineLink: formData.isOnline ? formData.onlineLink : ""
        },

        // Pricing and Capacity
        ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : 0,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        attendees: 0, // Default to 0

        // Contact Information
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || "",
        registrationUrl: formData.registrationUrl || "",

        // Status and Settings
        status: "pending", // Requires admin approval
        featured: false,

        // Metadata
        userId: "anonymous", // Will be updated when user auth is implemented
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add image if provided
      if (formData.image) {
        eventData.image = formData.image;
      }

      await addDoc(collection(db, 'events'), eventData);

      alert('Event submitted successfully! It will be visible after admin approval.');
      navigate('/events');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/events')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Add New Event
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Event Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Basic Information
          </Typography>

          <TextField
            fullWidth
            label="Event Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 3 characters"
          />

          <TextField
            fullWidth
            label="Event Description *"
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
            fullWidth
            label="Organizer Name *"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            placeholder="e.g., Iranian Cultural Association"
          />

          <FormControl fullWidth sx={{ mb: 3 }} required>
            <InputLabel>Event Category *</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Event Category *"
            >
              {eventCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 3 }} />

          {/* Date and Time */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Date & Time
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Event Date *"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              helperText="Optional"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Start Time *"
              name="eventTime"
              type="time"
              value={formData.eventTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              helperText="Optional"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Location Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Location
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isOnline}
                onChange={handleChange}
                name="isOnline"
                color="primary"
              />
            }
            label="This is an online event"
            sx={{ mb: 2 }}
          />

          {formData.isOnline ? (
            <TextField
              fullWidth
              label="Online Meeting Link *"
              name="onlineLink"
              value={formData.onlineLink}
              onChange={handleChange}
              sx={{ mb: 3 }}
              required
              placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
              helperText="Enter the full URL for the online meeting"
            />
          ) : (
            <>
              <TextField
                fullWidth
                label="Venue Name *"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
                placeholder="e.g., Community Center Hall"
              />

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

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Pricing and Capacity */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Pricing & Capacity
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Ticket Price"
              name="ticketPrice"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              sx={{ flex: 1 }}
              placeholder="0"
              helperText="Enter 0 for free events"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
            <TextField
              label="Maximum Attendees"
              name="maxAttendees"
              type="number"
              value={formData.maxAttendees}
              onChange={handleChange}
              sx={{ flex: 1 }}
              placeholder="Leave empty for unlimited"
              helperText="Optional"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Contact Information
          </Typography>

          <TextField
            fullWidth
            label="Contact Email *"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            placeholder="events@example.com"
            helperText="This email will be displayed for inquiries"
          />

          <TextField
            fullWidth
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="+1-416-555-0123"
            helperText="Optional"
          />

          <TextField
            fullWidth
            label="Registration URL"
            name="registrationUrl"
            value={formData.registrationUrl}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://eventbrite.com/your-event"
            helperText="Optional - External registration link"
          />

          <Divider sx={{ my: 3 }} />

          {/* Optional Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Additional Information
          </Typography>

          <TextField
            fullWidth
            label="Event Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://example.com/image.jpg"
            helperText="Optional - URL to event poster or image"
          />

          <Alert severity="info" sx={{ mb: 3 }}>
            Your event will be submitted for review and will be visible to the public once approved by an administrator.
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
            {loading ? 'Adding Event...' : 'Submit Event for Review'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddEventPage;
