import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Box,
  Fab,
  Rating,
  InputAdornment,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { Add, Search, LocationOn, Phone, Schedule, Restaurant, Star, AttachMoney } from '@mui/icons-material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'restaurants'));
      const restaurantsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const restaurantColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF8A80'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Material Design AppBar */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          m: 0,
          p: 0
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: '#fff', color: '#4ecdc4', mr: 2 }}>
            <Restaurant />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Restaurant
          </Typography>
          <Chip
            label={`${filteredRestaurants.length} Places`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 2, pb: 2, px: 2, m: 0 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search restaurants by name, cuisine, or location..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }
            }
          }}
        />

        {/* Restaurants Grid */}
        <Grid container spacing={3}>
          {filteredRestaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid ${restaurantColors[index % restaurantColors.length]}20`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                    border: `2px solid ${restaurantColors[index % restaurantColors.length]}`,
                  },
                }}
              >
                {restaurant.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={restaurant.image}
                    alt={restaurant.name}
                    sx={{
                      borderRadius: '16px 16px 0 0',
                      filter: 'brightness(0.9)'
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: restaurantColors[index % restaurantColors.length],
                        width: 32,
                        height: 32,
                        mr: 2
                      }}
                    >
                      <Restaurant sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: getTextDirection(restaurant.name) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(restaurant.name),
                        fontSize: '1.1rem',
                        flex: 1,
                        color: '#2c3e50'
                      }}
                    >
                      {restaurant.name}
                    </Typography>
                  </Box>

                  {restaurant.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={parseFloat(restaurant.rating)} readOnly size="small" />
                      <Chip
                        icon={<Star />}
                        label={restaurant.rating}
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: '#ffd700',
                          color: '#000',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: '#000'
                          }
                        }}
                      />
                    </Box>
                  )}

                  {restaurant.cuisine && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={restaurant.cuisine}
                        size="small"
                        sx={{
                          bgcolor: `${restaurantColors[index % restaurantColors.length]}15`,
                          color: restaurantColors[index % restaurantColors.length],
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${restaurant.address}, ${restaurant.city}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '& .MuiChip-icon': {
                          color: '#6c757d'
                        }
                      }}
                    />
                  </Box>

                  {restaurant.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<Phone />}
                        label={restaurant.phone}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: restaurantColors[index % restaurantColors.length],
                          color: restaurantColors[index % restaurantColors.length],
                          '& .MuiChip-icon': {
                            color: restaurantColors[index % restaurantColors.length]
                          }
                        }}
                      />
                    </Box>
                  )}

                  {restaurant.hours && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={<Schedule />}
                        label={restaurant.hours}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#28a745',
                          color: '#28a745',
                          '& .MuiChip-icon': {
                            color: '#28a745'
                          }
                        }}
                      />
                    </Box>
                  )}

                  {restaurant.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: getTextDirection(restaurant.description) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(restaurant.description),
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      {restaurant.description}
                    </Typography>
                  )}

                  {restaurant.priceRange && (
                    <Chip
                      icon={<AttachMoney />}
                      label={restaurant.priceRange}
                      size="small"
                      sx={{
                        bgcolor: restaurantColors[index % restaurantColors.length],
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {!loading && filteredRestaurants.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Avatar sx={{
              bgcolor: '#f8f9fa',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: '3px solid #e9ecef'
            }}>
              <Restaurant sx={{ fontSize: 40, color: '#6c757d' }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {searchQuery ? 'No restaurants found' : 'No restaurants available'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to add a restaurant!'}
            </Typography>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add restaurant"
          onClick={() => navigate('/addRestaurant')}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            boxShadow: '0 8px 32px rgba(78, 205, 196, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #26d0ce 0%, #2a9d8f 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(78, 205, 196, 0.6)',
            }
          }}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default RestaurantsPage;
