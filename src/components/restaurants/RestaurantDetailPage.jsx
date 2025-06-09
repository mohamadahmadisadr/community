import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Divider,
  Rating
} from "@mui/material";
import {
  ArrowBack,
  Restaurant,
  LocationOn,
  Phone,
  Schedule,
  Share,
  OpenInNew,
  CalendarToday,
  Star,
  AttachMoney,
  Email,
  Language,
  Payment,
  CheckCircle,
  AccessTime,
  Dining
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantDoc = await getDoc(doc(db, "restaurants", id));
        if (restaurantDoc.exists()) {
          setRestaurant({ id: restaurantDoc.id, ...restaurantDoc.data() });
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    } else {
      console.error('RestaurantDetailPage: No ID provided');
      setLoading(false);
    }
  }, [id]);

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "rtl" : "ltr";
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const handleCall = () => {
    const phoneNumber = restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, "_self");
    }
  };

  const handleShare = () => {
    const restaurantUrl = `${window.location.origin}/restaurant/${id}`;
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} - ${restaurant.cuisine} restaurant`,
        url: restaurantUrl,
      });
    } else {
      navigator.clipboard.writeText(restaurantUrl).then(() => {
        alert("Restaurant link copied to clipboard!");
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Loading...
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ pt: 4, pb: 2, px: 2, m: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#4ecdc4' }} />
        </Container>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Restaurant Not Found
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ pt: 4, pb: 2, px: 2, m: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
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
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Restaurant Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The restaurant you're looking for doesn't exist or has been removed.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar with restaurant name */}
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ bgcolor: '#fff', color: '#4ecdc4', mr: 2 }}>
            <Restaurant />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              textAlign: getTextDirection(restaurant.name) === "rtl" ? "right" : "left",
              fontFamily: getFontFamily(restaurant.name),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {restaurant.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Restaurant Image */}
        {restaurant.image && (
          <CardMedia
            component="img"
            height="250"
            image={restaurant.image}
            alt={restaurant.name}
            sx={{
              objectFit: "cover",
              filter: 'brightness(0.9)'
            }}
          />
        )}

        {/* Restaurant Details Card */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #4ecdc420',
              mb: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Restaurant Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(restaurant.name) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(restaurant.name),
                  color: '#2c3e50'
                }}
              >
                {restaurant.name}
              </Typography>

              {/* Rating */}
              {parseFloat(restaurant.rating) > 0 && (
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

              {/* Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {restaurant.cuisine && restaurant.cuisine.trim() !== '' && (
                  <Chip
                    label={restaurant.cuisine}
                    sx={{
                      bgcolor: '#4ecdc415',
                      color: '#4ecdc4',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {restaurant.priceRange && restaurant.priceRange.trim() !== '' && restaurant.priceRange !== '$$' && (
                  <Chip
                    icon={<AttachMoney />}
                    label={restaurant.priceRange}
                    variant="outlined"
                    sx={{
                      borderColor: '#4ecdc4',
                      color: '#4ecdc4',
                      '& .MuiChip-icon': {
                        color: '#4ecdc4'
                      }
                    }}
                  />
                )}
                {restaurant.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(restaurant.createdAt.seconds * 1000).toLocaleDateString()}
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
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Contact Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                  Contact Information
                </Typography>

                {(restaurant.location?.address || restaurant.address) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${restaurant.location?.address || restaurant.address}, ${restaurant.location?.city || restaurant.city}`}
                      variant="outlined"
                      sx={{
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: '#6c757d'
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: '#6c757d10'
                        }
                      }}
                      {...getClickableChipProps('address', restaurant.location?.address || restaurant.address, restaurant.location?.city || restaurant.city)}
                    />
                  </Box>
                )}

                {(restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Phone />}
                      label={restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone}
                      variant="outlined"
                      sx={{
                        borderColor: '#4ecdc4',
                        color: '#4ecdc4',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: '#4ecdc4'
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: '#4ecdc410'
                        }
                      }}
                      {...getClickableChipProps('phone', restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone)}
                    />
                  </Box>
                )}

                {(restaurant.contact?.email || restaurant.contactInfo?.email) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Email />}
                      label={restaurant.contact?.email || restaurant.contactInfo?.email}
                      variant="outlined"
                      sx={{
                        borderColor: '#dc3545',
                        color: '#dc3545',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: '#dc3545'
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: '#dc354510'
                        }
                      }}
                      {...getClickableChipProps('email', restaurant.contact?.email || restaurant.contactInfo?.email)}
                    />
                  </Box>
                )}

                {(restaurant.contact?.website || restaurant.contactInfo?.website) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Language />}
                      label="Visit Website"
                      variant="outlined"
                      sx={{
                        borderColor: '#17a2b8',
                        color: '#17a2b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: '#17a2b8'
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: '#17a2b810'
                        }
                      }}
                      onClick={() => window.open(restaurant.contact?.website || restaurant.contactInfo?.website, '_blank')}
                      title={`Visit ${restaurant.contact?.website || restaurant.contactInfo?.website}`}
                    />
                  </Box>
                )}

              </Box>

              {/* Hours */}
              {restaurant.hours && Object.values(restaurant.hours).some(h => h && h.trim() !== '') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Hours
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(restaurant.hours).map(([day, hours]) => (
                      hours && hours.trim() !== '' && (
                        <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'capitalize', minWidth: 80 }}>
                            {day}:
                          </Typography>
                          <Chip
                            icon={<AccessTime />}
                            label={hours}
                            size="small"
                            sx={{
                              bgcolor: '#28a74515',
                              color: '#28a745',
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: '#28a745'
                              }
                            }}
                          />
                        </Box>
                      )
                    ))}
                  </Box>
                </Box>
              )}

              {/* Features */}
              {restaurant.features && restaurant.features.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {restaurant.features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={<Dining />}
                        label={feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        sx={{
                          bgcolor: '#6f42c115',
                          color: '#6f42c1',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: '#6f42c1'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Payment Methods */}
              {restaurant.paymentMethods && restaurant.paymentMethods.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Payment Methods
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {restaurant.paymentMethods.map((method, index) => (
                      <Chip
                        key={index}
                        icon={<Payment />}
                        label={method.replace(/\b\w/g, l => l.toUpperCase())}
                        sx={{
                          bgcolor: '#fd7e1415',
                          color: '#fd7e14',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: '#fd7e14'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Status and Verification */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {restaurant.verified && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Verified"
                    sx={{
                      bgcolor: '#28a745',
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                )}
                {restaurant.featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    sx={{
                      bgcolor: '#ffd700',
                      color: '#000',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: '#000'
                      }
                    }}
                  />
                )}
                {restaurant.status && (
                  <Chip
                    label={restaurant.status.replace(/\b\w/g, l => l.toUpperCase())}
                    size="small"
                    sx={{
                      bgcolor: restaurant.status === 'approved' ? '#28a74515' : '#6c757d15',
                      color: restaurant.status === 'approved' ? '#28a745' : '#6c757d',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Box>

              {/* Description */}
              {restaurant.description && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      lineHeight: 1.8,
                      color: "text.primary",
                      textAlign: getTextDirection(restaurant.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(restaurant.description),
                      whiteSpace: "pre-line",
                    }}
                  >
                    {restaurant.description}
                  </Typography>
                </>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {(restaurant.contactInfo?.phone || restaurant.contact?.phone || restaurant.phone) && (
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={handleCall}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      boxShadow: '0 4px 20px rgba(78, 205, 196, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #26d0ce 0%, #3a8b7a 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(78, 205, 196, 0.4)',
                      }
                    }}
                  >
                    Call Now
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 3,
                    borderColor: '#4ecdc4',
                    color: '#4ecdc4',
                    '&:hover': {
                      borderColor: '#26d0ce',
                      backgroundColor: '#4ecdc410',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Comments Section - Separate Card */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #4ecdc420',
              mt: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <CommentsSection
                itemId={id}
                itemType="restaurant"
                color="#4ecdc4"
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantDetailPage;
