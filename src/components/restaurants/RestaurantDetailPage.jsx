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
  Share,
  CalendarToday,
  Star,
  AttachMoney,
  Email,
  Language,
  Payment,
  CheckCircle,
  AccessTime,
  Dining,
  MenuBook
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';
import { useTheme } from '@mui/material/styles';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar with restaurant name */}
      <AppBar
        position="static"
        sx={{
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
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mr: 2 }}>
            <Restaurant />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: theme.palette.primary.contrastText, // Use theme for header title color
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
        {/* Restaurant Image or Placeholder */}
        {restaurant.image ? (
          <CardMedia
            component="img"
            height="250"
            image={restaurant.image}
            alt={restaurant.name}
            sx={{
              objectFit: "cover"
            }}
          />
        ) : (
          <Box
            sx={{
              height: 250,
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Restaurant sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}

        {/* Restaurant Details */}
        <Box sx={{ px: 2, pt: 2 }}>
              {/* Restaurant Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(restaurant.name) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(restaurant.name),
                  color: theme.palette.text.primary
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
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              )}

              {/* Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {restaurant.cuisine && restaurant.cuisine.trim() !== '' && (
                  <Chip
                    label={restaurant.cuisine}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {restaurant.priceRange && restaurant.priceRange.trim() !== '' && restaurant.priceRange !== '$$' && (
                  <Chip
                    icon={<AttachMoney />}
                    label={restaurant.priceRange}
                    variant="outlined"
                    color="secondary"
                  />
                )}
                {restaurant.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(restaurant.createdAt.seconds * 1000).toLocaleDateString()}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Contact Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                  Contact Information
                </Typography>

                {(restaurant.location?.address || restaurant.address) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${restaurant.location?.address || restaurant.address}, ${restaurant.location?.city || restaurant.city}`}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.text.secondary,
                        color: theme.palette.text.secondary,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: theme.palette.text.secondary
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                          backgroundColor: 'rgba(108, 117, 125, 0.1)'
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
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: theme.palette.primary.main
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                          backgroundColor: 'rgba(78, 205, 196, 0.1)'
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
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: theme.palette.error.main
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                          backgroundColor: 'rgba(220, 53, 69, 0.1)'
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
                        borderColor: theme.palette.info.main,
                        color: theme.palette.info.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: theme.palette.info.main
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                          backgroundColor: 'rgba(23, 162, 184, 0.1)'
                        }
                      }}
                      onClick={() => window.open(restaurant.contact?.website || restaurant.contactInfo?.website, '_blank')}
                      title={`Visit ${restaurant.contact?.website || restaurant.contactInfo?.website}`}
                    />
                  </Box>
                )}

                {/* Menu URL */}
                {restaurant.menuUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<MenuBook />}
                      label="View Menu"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.warning.main,
                        color: theme.palette.warning.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: theme.palette.warning.main
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                          backgroundColor: 'rgba(255, 152, 0, 0.1)'
                        }
                      }}
                      onClick={() => window.open(restaurant.menuUrl, '_blank')}
                    />
                  </Box>
                )}

              </Box>

              {/* Hours */}
              {restaurant.hours && Object.values(restaurant.hours).some(h => h && h.trim() !== '') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
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
                              bgcolor: 'rgba(40, 167, 69, 0.1)',
                              color: theme.palette.success.main,
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: theme.palette.success.main
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
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {restaurant.features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={<Dining />}
                        label={feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        sx={{
                          bgcolor: 'rgba(111, 66, 193, 0.1)',
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: theme.palette.primary.main
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
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    Payment Methods
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {restaurant.paymentMethods.map((method, index) => (
                      <Chip
                        key={index}
                        icon={<Payment />}
                        label={method.replace(/\b\w/g, l => l.toUpperCase())}
                        sx={{
                          bgcolor: 'rgba(253, 126, 20, 0.1)',
                          color: theme.palette.warning.main,
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: theme.palette.warning.main
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
                      bgcolor: theme.palette.success.main,
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
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
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
                      bgcolor: restaurant.status === 'approved' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                      color: restaurant.status === 'approved' ? theme.palette.success.main : theme.palette.text.secondary,
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
                      fontSize: "1rem"
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
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: '#26d0ce',
                      backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>

              {/* Comments Section */}
              <CommentsSection
                itemId={id}
                itemType="restaurant"
              />
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantDetailPage;
