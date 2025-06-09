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
  LocalCafe,
  LocationOn,
  Phone,
  Schedule,
  Share,
  Wifi,
  CalendarToday,
  Star,
  AttachMoney,
  DirectionsCar,
  Pets,
  Email,
  Language,
  Payment,
  CheckCircle,
  AccessTime,
  Dining
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('CafeDetailPage: Component mounted with ID:', id);
    console.log('CafeDetailPage: Current URL:', window.location.href);

    const fetchCafe = async () => {
      try {
        console.log('CafeDetailPage: Fetching cafe with ID:', id);
        const cafeDoc = await getDoc(doc(db, "cafes", id));
        if (cafeDoc.exists()) {
          console.log('CafeDetailPage: Cafe found:', cafeDoc.data());
          setCafe({ id: cafeDoc.id, ...cafeDoc.data() });
        } else {
          console.error("CafeDetailPage: Cafe not found for ID:", id);
        }
      } catch (error) {
        console.error("CafeDetailPage: Error fetching cafe:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCafe();
    } else {
      console.error('CafeDetailPage: No ID provided');
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
    const phoneNumber = cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, "_self");
    }
  };

  const handleShare = () => {
    const cafeUrl = `${window.location.origin}/cafe/${id}`;
    if (navigator.share) {
      navigator.share({
        title: cafe.name,
        text: `Check out ${cafe.name} - ${cafe.specialty} café`,
        url: cafeUrl,
      });
    } else {
      navigator.clipboard.writeText(cafeUrl).then(() => {
        alert("Café link copied to clipboard!");
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          <CircularProgress size={60} sx={{ color: '#96ceb4' }} />
        </Container>
      </Box>
    );
  }

  if (!cafe) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Café Not Found
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
              <LocalCafe sx={{ fontSize: 40, color: '#6c757d' }} />
            </Avatar>
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Café Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The café you're looking for doesn't exist or has been removed.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar with cafe name */}
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ bgcolor: '#fff', color: '#96ceb4', mr: 2 }}>
            <LocalCafe />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              textAlign: getTextDirection(cafe.name) === "rtl" ? "right" : "left",
              fontFamily: getFontFamily(cafe.name),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {cafe.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Cafe Image */}
        {cafe.image && (
          <CardMedia
            component="img"
            height="250"
            image={cafe.image}
            alt={cafe.name}
            sx={{
              objectFit: "cover",
              filter: 'brightness(0.9)'
            }}
          />
        )}

        {/* Cafe Details Card */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #96ceb420',
              mb: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Cafe Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(cafe.name) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(cafe.name),
                  color: '#2c3e50'
                }}
              >
                {cafe.name}
              </Typography>

              {/* Rating */}
              {parseFloat(cafe.rating) > 0 && (
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

              {/* Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {cafe.specialty && cafe.specialty.trim() !== '' && (
                  <Chip
                    label={cafe.specialty}
                    sx={{
                      bgcolor: '#96ceb415',
                      color: '#96ceb4',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {cafe.priceRange && cafe.priceRange.trim() !== '' && cafe.priceRange !== '$$' && (
                  <Chip
                    icon={<AttachMoney />}
                    label={cafe.priceRange}
                    variant="outlined"
                    sx={{
                      borderColor: '#96ceb4',
                      color: '#96ceb4',
                      '& .MuiChip-icon': {
                        color: '#96ceb4'
                      }
                    }}
                  />
                )}
                {cafe.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(cafe.createdAt.seconds * 1000).toLocaleDateString()}
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

              {/* Features */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                  Features
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {cafe.hasWifi && (
                    <Chip
                      icon={<Wifi />}
                      label="WiFi"
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
                      label="Outdoor Seating"
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
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Contact Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                  Contact Information
                </Typography>

                {(cafe.location?.address || cafe.address) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${cafe.location?.address || cafe.address}, ${cafe.location?.city || cafe.city}`}
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
                      {...getClickableChipProps('address', cafe.location?.address || cafe.address, cafe.location?.city || cafe.city)}
                    />
                  </Box>
                )}

                {(cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Phone />}
                      label={cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone}
                      variant="outlined"
                      sx={{
                        borderColor: '#96ceb4',
                        color: '#96ceb4',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: '#96ceb4'
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: '#96ceb410'
                        }
                      }}
                      {...getClickableChipProps('phone', cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone)}
                    />
                  </Box>
                )}

                {(cafe.contact?.email || cafe.contactInfo?.email) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Email />}
                      label={cafe.contact?.email || cafe.contactInfo?.email}
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
                      {...getClickableChipProps('email', cafe.contact?.email || cafe.contactInfo?.email)}
                    />
                  </Box>
                )}

                {(cafe.contact?.website || cafe.contactInfo?.website) && (
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
                      onClick={() => window.open(cafe.contact?.website || cafe.contactInfo?.website, '_blank')}
                      title={`Visit ${cafe.contact?.website || cafe.contactInfo?.website}`}
                    />
                  </Box>
                )}

              </Box>

              {/* Hours */}
              {cafe.hours && Object.values(cafe.hours).some(h => h && h.trim() !== '') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Hours
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(cafe.hours).map(([day, hours]) => (
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
              {cafe.features && cafe.features.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Features & Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {cafe.features.map((feature, index) => {
                      let icon = <Dining />;
                      let color = '#6f42c1';

                      if (feature.toLowerCase().includes('wifi')) {
                        icon = <Wifi />;
                        color = '#17a2b8';
                      } else if (feature.toLowerCase().includes('parking')) {
                        icon = <DirectionsCar />;
                        color = '#6f42c1';
                      } else if (feature.toLowerCase().includes('pet')) {
                        icon = <Pets />;
                        color = '#fd7e14';
                      }

                      return (
                        <Chip
                          key={index}
                          icon={icon}
                          label={feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          sx={{
                            bgcolor: `${color}15`,
                            color: color,
                            fontWeight: 'bold',
                            '& .MuiChip-icon': {
                              color: color
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Payment Methods */}
              {cafe.paymentMethods && cafe.paymentMethods.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                    Payment Methods
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {cafe.paymentMethods.map((method, index) => (
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
                {cafe.verified && (
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
                {cafe.featured && (
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
                {cafe.status && (
                  <Chip
                    label={cafe.status.replace(/\b\w/g, l => l.toUpperCase())}
                    size="small"
                    sx={{
                      bgcolor: cafe.status === 'approved' ? '#28a74515' : '#6c757d15',
                      color: cafe.status === 'approved' ? '#28a745' : '#6c757d',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Box>

              {/* Description */}
              {cafe.description && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      lineHeight: 1.8,
                      color: "text.primary",
                      textAlign: getTextDirection(cafe.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(cafe.description),
                      whiteSpace: "pre-line",
                    }}
                  >
                    {cafe.description}
                  </Typography>
                </>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {(cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) && (
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
                      background: 'linear-gradient(135deg, #96ceb4 0%, #ffeaa7 100%)',
                      boxShadow: '0 4px 20px rgba(150, 206, 180, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #74b9a0 0%, #ffd93d 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(150, 206, 180, 0.4)',
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
                    borderColor: '#96ceb4',
                    color: '#96ceb4',
                    '&:hover': {
                      borderColor: '#74b9a0',
                      backgroundColor: '#96ceb410',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default CafeDetailPage;
