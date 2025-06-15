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
  LocalCafe,
  LocationOn,
  Phone,
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
import CommentsSection from '../common/CommentsSection';
import { useTheme } from '@mui/material/styles';

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const cafeDoc = await getDoc(doc(db, "cafes", id));
        if (cafeDoc.exists()) {
          setCafe({ id: cafeDoc.id, ...cafeDoc.data() });
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCafe();
    } else {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar with cafe name */}
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
        {/* Cafe Image or Placeholder */}
        {cafe.image ? (
          <CardMedia
            component="img"
            height="250"
            image={cafe.image}
            alt={cafe.name}
            sx={{
              objectFit: "cover"
            }}
          />
        ) : (
          <Box
            sx={{
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LocalCafe sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}

        {/* Cafe Details */}
        <Box sx={{ px: 2, pt: 2 }}>
              {/* Cafe Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(cafe.name) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(cafe.name),
                  color: theme.palette.text.primary
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
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              )}

              {/* Details */}
              {(cafe.specialty || cafe.priceRange || cafe.createdAt) && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {cafe.specialty && cafe.specialty.trim() !== '' && (
                    <Chip
                      label={cafe.specialty}
                      sx={{
                        bgcolor: theme.palette.success.light,
                        color: theme.palette.success.dark,
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
                        borderColor: theme.palette.success.main,
                        color: theme.palette.success.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.success.main
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
                        borderColor: theme.palette.text.secondary,
                        color: theme.palette.text.secondary,
                        '& .MuiChip-icon': {
                          color: theme.palette.text.secondary
                        }
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Description */}
              {cafe.description && (
                <>
                  {(cafe.specialty || cafe.priceRange || cafe.createdAt) && <Divider sx={{ mb: 3 }} />}
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

              {/* Features */}
              {cafe.features && cafe.features.length > 0 && (
                <>
                  {cafe.description && <Divider sx={{ mb: 3 }} />}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                      Features & Amenities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {cafe.features.map((feature, index) => {
                        let icon = <Dining />;
                        let color = theme.palette.primary.main;

                        if (feature.toLowerCase().includes('wifi')) {
                          icon = <Wifi />;
                          color = theme.palette.info.main;
                        } else if (feature.toLowerCase().includes('parking')) {
                          icon = <DirectionsCar />;
                          color = theme.palette.primary.main;
                        } else if (feature.toLowerCase().includes('pet')) {
                          icon = <Pets />;
                          color = theme.palette.warning.main;
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
                </>
              )}

              {/* Hours */}
              {cafe.hours && Object.values(cafe.hours).some(h => h && h.trim() !== '') && (
                <>
                  {(cafe.features?.length > 0 || cafe.description) && <Divider sx={{ mb: 3 }} />}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
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
                                bgcolor: theme.palette.success.light,
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
                </>
              )}

              {/* Contact Information */}
              {((cafe.location?.address || cafe.address) || 
                (cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) || 
                (cafe.contact?.email || cafe.contactInfo?.email) ||
                (cafe.contact?.website || cafe.contactInfo?.website)) && (
                <>
                  {(cafe.hours || cafe.features?.length > 0 || cafe.description) && <Divider sx={{ mb: 3 }} />}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                      Contact Information
                    </Typography>

                    {(cafe.location?.address || cafe.address) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={<LocationOn />}
                          label={`${cafe.location?.address || cafe.address}, ${cafe.location?.city || cafe.city}`}
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
                            borderColor: theme.palette.success.main,
                            color: theme.palette.success.main,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '& .MuiChip-icon': {
                              color: theme.palette.success.main
                            },
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: theme.shadows[2],
                              backgroundColor: 'rgba(150, 206, 180, 0.1)'
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
                          onClick={() => window.open(cafe.contact?.website || cafe.contactInfo?.website, '_blank')}
                          title={`Visit ${cafe.contact?.website || cafe.contactInfo?.website}`}
                        />
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Action Buttons */}
              {((cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) || cafe.id) && (
                <>
                  {((cafe.location?.address || cafe.address) || 
                    (cafe.contactInfo?.phone || cafe.contact?.phone || cafe.phone) || 
                    (cafe.contact?.email || cafe.contactInfo?.email) ||
                    (cafe.contact?.website || cafe.contactInfo?.website)) && <Divider sx={{ mb: 3 }} />}
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
                    {cafe.id && (
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
                          borderColor: theme.palette.success.main,
                          color: theme.palette.success.main,
                          '&:hover': {
                            borderColor: '#74b9a0',
                            backgroundColor: 'rgba(150, 206, 180, 0.1)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        Share
                      </Button>
                    )}
                  </Stack>
                </>
              )}

              {/* Comments Section */}
              <CommentsSection
                itemId={id}
                itemType="cafe"
              />
        </Box>
      </Container>
    </Box>
  );
};

export default CafeDetailPage;
