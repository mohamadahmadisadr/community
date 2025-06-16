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
  Grid
} from "@mui/material";
import {
  ArrowBack,
  Home,
  LocationOn,
  Phone,
  Share,
  CalendarToday,
  AttachMoney,
  Email,
  Language,
  Bed,
  Bathtub,
  SquareFoot,
  DirectionsCar,
  Pets,
  SmokingRooms,
  CheckCircle,
  Person,
  Schedule
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';
import { useTheme } from '@mui/material/styles';

const RentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const rentalDoc = await getDoc(doc(db, "rent", id));
        if (rentalDoc.exists()) {
          setRental({ id: rentalDoc.id, ...rentalDoc.data() });
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRental();
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

  const formatPrice = (rental) => {
    if (!rental.pricing?.rent) return 'Contact for price';
    const currency = rental.pricing.currency || 'CAD';
    const symbol = currency === 'CAD' ? '$' : currency;
    return `${symbol}${rental.pricing.rent.toLocaleString()}/month`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatFeatureName = (feature) => {
    return feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleShare = async () => {
    const shareData = {
      title: rental.title,
      text: `Check out this rental property: ${rental.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rental) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" sx={{ m: 0, p: 0 }}>
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
              Property Not Found
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ pt: 4, pb: 2, px: 2, m: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'background.paper', 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              border: `3px solid ${theme.palette.divider}`
            }}>
              <Home sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
            </Avatar>
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Property Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The property you're looking for doesn't exist or has been removed.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar with property title */}
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
            <Home />
          </Avatar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              textAlign: getTextDirection(rental.title) === "rtl" ? "right" : "left",
              fontFamily: getFontFamily(rental.title),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {rental.title}
          </Typography>
          <IconButton color="inherit" onClick={handleShare}>
            <Share />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Property Image or Placeholder */}
        {rental.images && rental.images.length > 0 ? (
          <CardMedia
            component="img"
            height="250"
            image={rental.images[0]}
            alt={rental.title}
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
            <Home sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}

        {/* Property Details */}
        <Box sx={{ px: 2, pt: 2 }}>
              {/* Property Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(rental.title) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(rental.title),
                  color: theme.palette.text.primary
                }}
              >
                {rental.title}
              </Typography>

              {/* Property Type and Category */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {rental.type && (
                  <Chip
                    label={rental.type.charAt(0).toUpperCase() + rental.type.slice(1)}
                    color="primary"
                    variant="filled"
                  />
                )}
                {rental.category && (
                  <Chip
                    label={rental.category.replace('-', ' ')}
                    color="secondary"
                    variant="filled"
                  />
                )}
                {rental.featured && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Featured"
                    color="success"
                    variant="filled"
                  />
                )}
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                {formatPrice(rental)}
              </Typography>

              {/* Location */}
              {(rental.location?.city || rental.location?.address) && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                  <Box>
                    {rental.location.address && (
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {rental.location.address}
                      </Typography>
                    )}
                    {rental.location.city && (
                      <Typography variant="body2" color="text.secondary">
                        {rental.location.city}{rental.location.province && `, ${rental.location.province}`}
                      </Typography>
                    )}
                    {rental.location.postalCode && (
                      <Typography variant="body2" color="text.secondary">
                        {rental.location.postalCode}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {/* Property Details Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {rental.propertyDetails?.bedrooms >= 0 && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Bed sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {rental.propertyDetails.bedrooms}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bedroom{rental.propertyDetails.bedrooms !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {rental.propertyDetails?.bathrooms >= 0 && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Bathtub sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {rental.propertyDetails.bathrooms}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bathroom{rental.propertyDetails.bathrooms !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {rental.propertyDetails?.area && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SquareFoot sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {rental.propertyDetails.area.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sq Ft
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {rental.propertyDetails?.furnished && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {rental.propertyDetails.furnished.charAt(0).toUpperCase() + rental.propertyDetails.furnished.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Furnished
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Description
              </Typography>
              <Typography
                paragraph
                sx={{
                  textAlign: getTextDirection(rental.description) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(rental.description),
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {rental.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Availability */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Availability
              </Typography>
              <Box sx={{ mb: 3 }}>
                {rental.availability?.availableFrom && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      Available from: {formatDate(rental.availability.availableFrom)}
                    </Typography>
                  </Box>
                )}
                {rental.availability?.leaseTerm && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      Lease term: {rental.availability.leaseTerm.replace('-', ' ')}
                    </Typography>
                  </Box>
                )}
                {rental.availability?.viewingSchedule && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Person sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                    <Typography>
                      Viewing: {rental.availability.viewingSchedule}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Pricing Details */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pricing Details
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>
                    Monthly rent: {formatPrice(rental)}
                  </Typography>
                </Box>
                {rental.pricing?.deposit > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      Security deposit: ${rental.pricing.deposit.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                {rental.pricing?.utilitiesIncluded && rental.pricing.utilitiesIncluded.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Utilities Included:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {rental.pricing.utilitiesIncluded.map((utility) => (
                        <Chip
                          key={utility}
                          label={formatFeatureName(utility)}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Property Features */}
              {rental.features && rental.features.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Property Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {rental.features.map((feature) => (
                      <Chip
                        key={feature}
                        label={formatFeatureName(feature)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Building Amenities */}
              {rental.amenities && rental.amenities.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Building Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {rental.amenities.map((amenity) => (
                      <Chip
                        key={amenity}
                        label={formatFeatureName(amenity)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Additional Property Details */}
              {(rental.propertyDetails?.parking || rental.propertyDetails?.petPolicy || rental.propertyDetails?.smokingPolicy) && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Additional Details
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {rental.propertyDetails.parking && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>
                          Parking: {formatFeatureName(rental.propertyDetails.parking)}
                        </Typography>
                      </Box>
                    )}
                    {rental.propertyDetails.petPolicy && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Pets sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>
                          Pet policy: {formatFeatureName(rental.propertyDetails.petPolicy)}
                        </Typography>
                      </Box>
                    )}
                    {rental.propertyDetails.smokingPolicy && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SmokingRooms sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>
                          Smoking policy: {formatFeatureName(rental.propertyDetails.smokingPolicy)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Contact Information */}
              {(rental.contactInfo?.phone || rental.contactInfo?.email) && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {rental.contactInfo.phone && (
                      <Chip
                        icon={<Phone />}
                        label={rental.contactInfo.phone}
                        {...getClickableChipProps('phone', rental.contactInfo.phone)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    {rental.contactInfo.email && (
                      <Chip
                        icon={<Email />}
                        label={rental.contactInfo.email}
                        {...getClickableChipProps('email', rental.contactInfo.email)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    {rental.contactInfo.preferredContact && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Preferred contact: {rental.contactInfo.preferredContact}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Virtual Tour */}
              {rental.virtualTour && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Virtual Tour
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Language />}
                    href={rental.virtualTour}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 3 }}
                  >
                    View Virtual Tour
                  </Button>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Additional Images */}
              {rental.images && rental.images.length > 1 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    More Images
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {rental.images.slice(1).map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={image}
                          alt={`${rental.title} - Image ${index + 2}`}
                          sx={{
                            borderRadius: 2,
                            objectFit: 'cover'
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                </>
              )}
        </Box>

        {/* Comments Section */}
        <Box sx={{ px: 2 }}>
          <CommentsSection itemId={id} itemType="rent" />
        </Box>
      </Container>
    </Box>
  );
};

export default RentDetailPage;
