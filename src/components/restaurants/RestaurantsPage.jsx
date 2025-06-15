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
      restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // New database structure
      restaurant.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location?.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Legacy structure
      restaurant.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Features search
      restaurant.features?.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      // Payment methods search
      restaurant.paymentMethods?.some(method => method.toLowerCase().includes(searchQuery.toLowerCase()))
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

                  {/* Cuisine and Category */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {restaurant.cuisine && (
                      <Chip
                        label={restaurant.cuisine}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                    {restaurant.category && restaurant.category !== 'Restaurant' && (
                      <Chip
                        label={restaurant.category}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    )}
                  </Box>

                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={(() => {
                        // Support both new and legacy location structures
                        if (restaurant.location?.address && restaurant.location?.city) {
                          return `${restaurant.location.address}, ${restaurant.location.city}`;
                        } else if (restaurant.address && restaurant.city) {
                          return `${restaurant.address}, ${restaurant.city}`;
                        } else if (restaurant.location?.city) {
                          return restaurant.location.city;
                        } else if (restaurant.city) {
                          return restaurant.city;
                        }
                        return 'Location not specified';
                      })()}
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

                  {/* Phone - support both new and legacy structures */}
                  {(restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<Phone />}
                        label={restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone}
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

                  {/* Hours - show today's hours if available */}
                  {restaurant.hours && typeof restaurant.hours === 'object' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<Schedule />}
                        label={(() => {
                          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                          const todayHours = restaurant.hours[today];
                          return todayHours || 'Hours available';
                        })()}
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

                  {/* Legacy hours support */}
                  {restaurant.hours && typeof restaurant.hours === 'string' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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

                  {/* Features - show first few features */}
                  {restaurant.features && restaurant.features.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      {restaurant.features.slice(0, 3).map((feature, featureIndex) => (
                        <Chip
                          key={featureIndex}
                          label={feature.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(111, 66, 193, 0.1)',
                            color: theme.palette.primary.main,
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                      {restaurant.features.length > 3 && (
                        <Chip
                          label={`+${restaurant.features.length - 3} more`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(108, 117, 125, 0.1)',
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
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
