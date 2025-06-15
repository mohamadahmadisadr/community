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
import { Add, Search, LocationOn, Phone, Wifi, LocalCafe, Star, AttachMoney, DirectionsCar, Pets, AccessTime } from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CafesPage = () => {
  const [cafes, setCafes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cafes'));
      const cafesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCafes(cafesData);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCafes = cafes.filter(
    (cafe) =>
      cafe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // New database structure
      cafe.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.location?.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Legacy structure
      cafe.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Features search
      cafe.features?.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  return (
    <AppBarLayout
      title="Café"
      icon={<LocalCafe />}
      gradient="linear-gradient(135deg, #96ceb4 0%, #ffeaa7 100%)"
      iconColor="#96ceb4"
      count={filteredCafes.length}
      countLabel="Cafés"
    >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search cafés by name, specialty, category, or location..."
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

        {/* Cafes Grid */}
        <Grid container spacing={3}>
          {filteredCafes.map((cafe) => (
            <Grid item xs={12} sm={6} md={4} key={cafe.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {cafe.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={cafe.image}
                    alt={cafe.name}
                    sx={{
                      borderRadius: '8px 8px 0 0'
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                        mr: 2
                      }}
                    >
                      <LocalCafe sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: getTextDirection(cafe.name) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(cafe.name),
                        fontSize: '1.1rem',
                        flex: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {cafe.name}
                    </Typography>
                  </Box>

                  {cafe.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={parseFloat(cafe.rating)} readOnly size="small" />
                      <Chip
                        icon={<Star />}
                        label={cafe.rating}
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

                  {/* Specialty and Category */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {cafe.specialty && (
                      <Chip
                        label={cafe.specialty}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                    {cafe.category && cafe.category !== 'Cafe' && (
                      <Chip
                        label={cafe.category}
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
                        if (cafe.location?.address && cafe.location?.city) {
                          return `${cafe.location.address}, ${cafe.location.city}`;
                        } else if (cafe.address && cafe.city) {
                          return `${cafe.address}, ${cafe.city}`;
                        } else if (cafe.location?.city) {
                          return cafe.location.city;
                        } else if (cafe.city) {
                          return cafe.city;
                        }
                        return 'Location not specified';
                      })()}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.secondary,
                        '& .MuiChip-icon': {
                          color: theme.palette.text.secondary
                        }
                      }}
                    />
                  </Box>

                  {/* Phone - support both new and legacy structures */}
                  {(cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<Phone />}
                        label={cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                  )}

                  {/* Hours - show today's hours if available */}
                  {cafe.hours && typeof cafe.hours === 'object' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<AccessTime />}
                        label={(() => {
                          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                          const todayHours = cafe.hours[today];
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
                  {cafe.hours && typeof cafe.hours === 'string' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<AccessTime />}
                        label={cafe.hours}
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

                  {cafe.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: getTextDirection(cafe.description) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(cafe.description),
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      {cafe.description}
                    </Typography>
                  )}

                  {/* Features - show first few features */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {/* New database structure - features array */}
                    {cafe.features && Array.isArray(cafe.features) && cafe.features.slice(0, 4).map((feature, featureIndex) => {
                      // Map feature names to icons
                      const getFeatureIcon = (featureName) => {
                        const lowerFeature = featureName.toLowerCase();
                        if (lowerFeature.includes('wifi')) return <Wifi />;
                        if (lowerFeature.includes('parking')) return <DirectionsCar />;
                        if (lowerFeature.includes('pet')) return <Pets />;
                        return null;
                      };

                      return (
                        <Chip
                          key={featureIndex}
                          icon={getFeatureIcon(feature)}
                          label={feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(111, 66, 193, 0.1)',
                            color: theme.palette.primary.main,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        />
                      );
                    })}

                    {/* Legacy structure support */}
                    {!cafe.features && (
                      <>
                        {cafe.hasWifi && (
                          <Chip
                            icon={<Wifi />}
                            label="WiFi"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.info.main,
                              color: theme.palette.info.contrastText,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: theme.palette.info.contrastText
                              }
                            }}
                          />
                        )}
                        {cafe.hasOutdoorSeating && (
                          <Chip
                            label="Outdoor"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.success.main,
                              color: theme.palette.success.contrastText,
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                        {cafe.hasParking && (
                          <Chip
                            icon={<DirectionsCar />}
                            label="Parking"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              color: theme.palette.secondary.contrastText,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: theme.palette.secondary.contrastText
                              }
                            }}
                          />
                        )}
                        {cafe.petFriendly && (
                          <Chip
                            icon={<Pets />}
                            label="Pet Friendly"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.warning.main,
                              color: theme.palette.warning.contrastText,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: theme.palette.warning.contrastText
                              }
                            }}
                          />
                        )}
                      </>
                    )}

                    {/* Show count if more features available */}
                    {cafe.features && cafe.features.length > 4 && (
                      <Chip
                        label={`+${cafe.features.length - 4} more`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(108, 117, 125, 0.1)',
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>

                  {cafe.priceRange && (
                    <Chip
                      icon={<AttachMoney />}
                      label={cafe.priceRange}
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
        {!loading && filteredCafes.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Avatar sx={{
              bgcolor: theme.palette.background.paper,
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: `3px solid ${theme.palette.divider}`
            }}>
              <LocalCafe sx={{ fontSize: 40, color: '#6c757d' }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {searchQuery ? 'No cafés found' : 'No cafés available'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to add a café!'}
            </Typography>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add cafe"
          onClick={() => navigate('/addCafe')}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            boxShadow: '0 8px 32px rgba(150, 206, 180, 0.4)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(150, 206, 180, 0.6)',
            }
          }}
        >
          <Add />
        </Fab>
    </AppBarLayout>
  );
};

export default CafesPage;
