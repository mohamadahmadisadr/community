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
import { Add, Search, LocationOn, Phone, Schedule, Wifi, LocalCafe, Star, AttachMoney, DirectionsCar, Pets } from '@mui/icons-material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CafesPage = () => {
  const [cafes, setCafes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Material Design AppBar */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #96ceb4 0%, #ffeaa7 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          m: 0,
          p: 0
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: '#fff', color: '#96ceb4', mr: 2 }}>
            <LocalCafe />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Café
          </Typography>
          <Chip
            label={`${filteredCafes.length} Cafés`}
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
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid ${cafeColors[index % cafeColors.length]}20`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                    border: `2px solid ${cafeColors[index % cafeColors.length]}`,
                  },
                }}
              >
                {cafe.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={cafe.image}
                    alt={cafe.name}
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
                        bgcolor: cafeColors[index % cafeColors.length],
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
                        color: '#2c3e50'
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
                        sx={{
                          bgcolor: `${cafeColors[index % cafeColors.length]}15`,
                          color: cafeColors[index % cafeColors.length],
                          fontWeight: 'bold'
                        }}
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
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '& .MuiChip-icon': {
                          color: '#6c757d'
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
                        sx={{
                          borderColor: cafeColors[index % cafeColors.length],
                          color: cafeColors[index % cafeColors.length],
                          '& .MuiChip-icon': {
                            color: cafeColors[index % cafeColors.length]
                          }
                        }}
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
                          bgcolor: '#17a2b8',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    )}
                    {cafe.hasOutdoorSeating && (
                      <Chip
                        label="Outdoor"
                        size="small"
                        sx={{
                          bgcolor: '#28a745',
                          color: 'white',
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
                          bgcolor: '#6f42c1',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
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
                          bgcolor: '#fd7e14',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
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
                      sx={{
                        bgcolor: cafeColors[index % cafeColors.length],
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
        {!loading && filteredCafes.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Avatar sx={{
              bgcolor: '#f8f9fa',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: '3px solid #e9ecef'
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
            background: 'linear-gradient(135deg, #96ceb4 0%, #ffeaa7 100%)',
            boxShadow: '0 8px 32px rgba(150, 206, 180, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #74b9a0 0%, #fdd835 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(150, 206, 180, 0.6)',
            }
          }}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default CafesPage;
