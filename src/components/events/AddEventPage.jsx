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

const AddEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    city: '',
    price: '',
    image: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const eventCategories = [
    'Cultural',
    'Educational',
    'Social',
    'Religious',
    'Business',
    'Entertainment',
    'Sports',
    'Art',
    'Music',
    'Food',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.location || !formData.city) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);

    try {
      const imageUrl = formData.image || 'https://placehold.co/400x300/1976d2/white?text=Event';

      await addDoc(collection(db, 'events'), {
        ...formData,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert('Event added successfully!');
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
          <TextField
            fullWidth
            label="Event Title *"
            name="title"
            value={formData.title}
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

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Date *"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Location/Venue *"
            name="location"
            value={formData.location}
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {eventCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Price (Enter 'Free' for free events)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="e.g., Free, 25, 50"
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
            {loading ? 'Adding Event...' : 'Add Event'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddEventPage;
