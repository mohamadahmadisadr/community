import { useState, useEffect } from 'react';
import {
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
  Avatar,
  useTheme,
} from '@mui/material';
import { Add, Search, LocationOn, Phone, Schedule, Restaurant, Star, AttachMoney } from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

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
    <AppBarLayout
      title="Restaurant"
      icon={<Restaurant />}
      gradient="linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
      iconColor="#4ecdc4"
      count={filteredRestaurants.length}
      countLabel="Places"
    >
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
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {restaurant.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={restaurant.image}
                    alt={restaurant.name}
                    sx={{
                      borderRadius: '8px 8px 0 0'
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
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
                        color: theme.palette.text.primary
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
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  )}

                  {restaurant.cuisine && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={restaurant.cuisine}
                        size="small"
                        variant="outlined"
                        color="primary"
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
                        borderColor: theme.palette.text.secondary,
                        color: theme.palette.text.secondary,
                        '& .MuiChip-icon': {
                          color: theme.palette.text.secondary
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
                          borderColor: theme.palette.success.main,
                          color: theme.palette.success.main,
                          '& .MuiChip-icon': {
                            color: theme.palette.success.main
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
                      color="secondary"
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
              bgcolor: theme.palette.background.paper,
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: `3px solid ${theme.palette.divider}`
            }}>
              <Restaurant sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
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
    </AppBarLayout>
  );
};

export default RestaurantsPage;
