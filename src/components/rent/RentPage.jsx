import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  Avatar,
  Button,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Add,
  Search,
  LocationOn,
  Home,
  Bed,
  Bathtub,
  SquareFoot,
  AttachMoney,
  Visibility,
  CalendarToday,
  Person,
  FilterList,
  ExpandMore,
  Clear
} from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import usePagination from '../../hooks/usePagination';
import InfiniteScrollComponent from '../../components/common/InfiniteScrollComponent';
import RentFilters from './RentFilters';

const RentPage = () => {
  const [rentals, setRentals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    city: '',
    province: '',
    priceRange: [0, 10000],
    bedrooms: '',
    bathrooms: '',
    furnished: '',
    parking: '',
    petPolicy: '',
    features: [],
    amenities: []
  });

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      // Get all rentals and filter for approved ones or those without status (old data)
      const querySnapshot = await getDocs(collection(db, 'rent'));
      const rentalsData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((rental) => {
          // Show rentals that are approved/active OR don't have a status field (old data)
          return !rental.status || rental.status === "active" || rental.status === "approved";
        });
      setRentals(rentalsData);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  // Predefined filter options
  const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'basement', label: 'Basement' },
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'other', label: 'Other' }
  ];

  const RENTAL_CATEGORIES = [
    { value: 'long-term', label: 'Long-term' },
    { value: 'short-term', label: 'Short-term' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'student-housing', label: 'Student Housing' },
    { value: 'shared-accommodation', label: 'Shared Accommodation' },
    { value: 'vacation-rental', label: 'Vacation Rental' }
  ];

  const CANADIAN_CITIES = [
    'Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Oshawa', 'Barrie',
    'Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Vancouver', 'Surrey', 'Burnaby',
    'Calgary', 'Edmonton', 'Red Deer', 'Winnipeg', 'Brandon', 'Saskatoon', 'Regina',
    'Halifax', 'Sydney', 'Saint John', 'Moncton', 'Fredericton', "St. John's", 'Charlottetown'
  ];

  const CANADIAN_PROVINCES = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ];

  const FURNISHED_OPTIONS = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi-furnished', label: 'Semi-furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const PARKING_OPTIONS = [
    { value: 'none', label: 'No Parking' },
    { value: 'street-parking', label: 'Street Parking' },
    { value: 'driveway', label: 'Driveway' },
    { value: 'garage', label: 'Garage' },
    { value: 'underground-garage', label: 'Underground Garage' },
    { value: 'surface-lot', label: 'Surface Lot' },
    { value: 'assigned-spot', label: 'Assigned Spot' },
    { value: 'visitor-parking', label: 'Visitor Parking' }
  ];

  const PET_POLICIES = [
    { value: 'no-pets', label: 'No Pets' },
    { value: 'cats-allowed', label: 'Cats Allowed' },
    { value: 'dogs-allowed', label: 'Dogs Allowed' },
    { value: 'small-pets-only', label: 'Small Pets Only' },
    { value: 'pets-negotiable', label: 'Pets Negotiable' },
    { value: 'pet-deposit-required', label: 'Pet Deposit Required' }
  ];

  // Apply filters to rentals
  const filteredRentals = rentals.filter((rental) => {
    // Text search
    const matchesSearch = !searchQuery || (
      rental.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter conditions
    const matchesType = !filters.type || rental.type === filters.type;
    const matchesCategory = !filters.category || rental.category === filters.category;
    const matchesCity = !filters.city || rental.location?.city === filters.city;
    const matchesProvince = !filters.province || rental.location?.province === filters.province;

    const rentalPrice = rental.pricing?.rent || 0;
    const matchesPrice = rentalPrice >= filters.priceRange[0] && rentalPrice <= filters.priceRange[1];

    const matchesBedrooms = !filters.bedrooms || rental.propertyDetails?.bedrooms === parseInt(filters.bedrooms);
    const matchesBathrooms = !filters.bathrooms || rental.propertyDetails?.bathrooms === parseFloat(filters.bathrooms);
    const matchesFurnished = !filters.furnished || rental.propertyDetails?.furnished === filters.furnished;
    const matchesParking = !filters.parking || rental.propertyDetails?.parking === filters.parking;
    const matchesPetPolicy = !filters.petPolicy || rental.propertyDetails?.petPolicy === filters.petPolicy;

    return matchesSearch && matchesType && matchesCategory && matchesCity &&
           matchesProvince && matchesPrice && matchesBedrooms && matchesBathrooms &&
           matchesFurnished && matchesParking && matchesPetPolicy;
  });

  // Infinite Scroll Pagination
  const {
    paginatedData: displayedRentals,
    resetPagination,
    totalItems,
    displayedItemsCount,
    loadingRef,
    hasMoreItems,
    isLoading
  } = usePagination(filteredRentals, 6, true); // Enable infinite scroll

  // Reset pagination when search changes or filters change
  React.useEffect(() => {
    resetPagination();
  }, [searchQuery, filters, resetPagination]);

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      type: '',
      category: '',
      city: '',
      province: '',
      priceRange: [0, 10000],
      bedrooms: '',
      bathrooms: '',
      furnished: '',
      parking: '',
      petPolicy: '',
      features: [],
      amenities: []
    });
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.category) count++;
    if (filters.city) count++;
    if (filters.province) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.furnished) count++;
    if (filters.parking) count++;
    if (filters.petPolicy) count++;
    return count;
  };

  const handleViewDetails = (rental) => {
    navigate(`/rent/${rental.id}`);
  };

  const formatPrice = (rental) => {
    if (!rental.pricing?.rent) return 'Contact for price';
    const currency = rental.pricing.currency || 'CAD';
    const symbol = currency === 'CAD' ? '$' : currency;
    return `${symbol}${rental.pricing.rent.toLocaleString()}/month`;
  };

  const getPropertyDetails = (rental) => {
    const details = [];
    if (rental.propertyDetails?.bedrooms >= 0) {
      details.push(`${rental.propertyDetails.bedrooms} bed${rental.propertyDetails.bedrooms !== 1 ? 's' : ''}`);
    }
    if (rental.propertyDetails?.bathrooms >= 0) {
      details.push(`${rental.propertyDetails.bathrooms} bath${rental.propertyDetails.bathrooms !== 1 ? 's' : ''}`);
    }
    if (rental.propertyDetails?.area) {
      details.push(`${rental.propertyDetails.area} sqft`);
    }
    return details.join(' • ');
  };



  if (loading) {
    return (
      <AppBarLayout
        title="Rent"
        icon={<Home />}
        count={0}
        countLabel="Properties"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography>Loading properties...</Typography>
        </Box>
      </AppBarLayout>
    );
  }

  return (
    <AppBarLayout
      title="Rent"
      icon={<Home />}
      count={filteredRentals.length}
      countLabel="Properties"
    >
      {/* Search and Filter Header */}
      <Box sx={{ mb: 3 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search properties by title, location, or type..."
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
          sx={{ mb: 2 }}
        />

        {/* Filter Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3
            }}
          >
            Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>

          {getActiveFiltersCount() > 0 && (
            <Button
              variant="text"
              startIcon={<Clear />}
              onClick={clearAllFilters}
              sx={{
                textTransform: 'none',
                color: 'text.secondary'
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Collapsible Filters */}
        <Collapse in={showFilters}>
          <RentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearAllFilters}
            PROPERTY_TYPES={PROPERTY_TYPES}
            RENTAL_CATEGORIES={RENTAL_CATEGORIES}
            CANADIAN_CITIES={CANADIAN_CITIES}
            CANADIAN_PROVINCES={CANADIAN_PROVINCES}
            FURNISHED_OPTIONS={FURNISHED_OPTIONS}
            PARKING_OPTIONS={PARKING_OPTIONS}
            PET_POLICIES={PET_POLICIES}
          />
        </Collapse>
      </Box>



      {/* Properties Grid */}
      <Grid container spacing={3}>
        {displayedRentals.map((rental) => (
          <Grid item xs={12} sm={6} md={4} key={rental.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image or Placeholder */}
              {rental.images && rental.images.length > 0 ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={rental.images[0]}
                  alt={rental.title}
                  sx={{
                    borderRadius: '8px 8px 0 0'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 160,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0'
                  }}
                >
                  <Home sx={{ fontSize: 48, color: 'grey.400' }} />
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Property Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    textAlign: getTextDirection(rental.title) === 'rtl' ? 'right' : 'left',
                    fontFamily: getFontFamily(rental.title),
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3
                  }}
                >
                  {rental.title}
                </Typography>

                {/* Property Type and Category */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  {rental.type && (
                    <Chip
                      label={rental.type.charAt(0).toUpperCase() + rental.type.slice(1)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {rental.category && (
                    <Chip
                      label={rental.category.replace('-', ' ')}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Location */}
                {(rental.location?.city || rental.location?.address) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {rental.location.city && rental.location.address
                        ? `${rental.location.address}, ${rental.location.city}`
                        : rental.location.city || rental.location.address
                      }
                    </Typography>
                  </Box>
                )}

                {/* Price */}
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {formatPrice(rental)}
                </Typography>

                {/* Property Details */}
                {getPropertyDetails(rental) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {getPropertyDetails(rental)}
                  </Typography>
                )}

                {/* Available From */}
                {rental.availability?.availableFrom && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Available: {new Date(rental.availability.availableFrom.seconds * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {/* Description */}
                {rental.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: getTextDirection(rental.description) === 'rtl' ? 'right' : 'left',
                      fontFamily: getFontFamily(rental.description),
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5,
                      mb: 2,
                      flex: 1
                    }}
                  >
                    {rental.description}
                  </Typography>
                )}

                {/* Action Button */}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleViewDetails(rental)}
                  sx={{
                    textTransform: 'none',
                    mt: 'auto',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark
                    }
                  }}
                  fullWidth
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Infinite Scroll */}
      {!loading && filteredRentals.length > 0 && (
        <InfiniteScrollComponent
          totalItems={totalItems}
          displayedItemsCount={displayedItemsCount}
          hasMoreItems={hasMoreItems}
          loadingRef={loadingRef}
          isLoading={isLoading}
          color="#2196f3"
        />
      )}

      {/* Empty State */}
      {!loading && filteredRentals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
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
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
            No Properties Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchQuery ? 'Try adjusting your search terms' : `Be the first to add a property for rent!`}
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add rental property"
        onClick={() => navigate('/addRent')}
        sx={{
          position: 'fixed',
          bottom: 120,
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
    </AppBarLayout>
  );
};

export default RentPage; 