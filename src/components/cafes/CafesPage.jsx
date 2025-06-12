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
import { Add, Search, LocationOn, Phone, Schedule, Wifi, LocalCafe, Star, AttachMoney, DirectionsCar, Pets } from '@mui/icons-material';
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
      cafe.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const cafeColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF8A80'];

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
          placeholder="Search cafés by name, specialty, or location..."
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
          {filteredCafes.map((cafe, index) => (
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

                  {cafe.specialty && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={cafe.specialty}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${cafe.address}, ${cafe.city}`}
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

                  {cafe.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={<Phone />}
                        label={cafe.phone}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                  )}

                  {cafe.hours && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={<Schedule />}
                        label={cafe.hours}
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

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
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
