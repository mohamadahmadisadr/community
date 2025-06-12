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
  Rating,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { Add, Search, LocationOn, Phone, Schedule, Wifi, Restaurant, LocalCafe, Star, AttachMoney, DirectionsCar, Pets, Visibility } from '@mui/icons-material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import AppBarLayout from '../../layouts/AppBarLayout';
import usePagination from '../../hooks/usePagination';
import InfiniteScrollComponent from '../../components/common/InfiniteScrollComponent';
import { useTheme } from '@mui/material/styles';


const DiningPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchDiningData();
  }, []);

  const fetchDiningData = async () => {
    try {
      const [restaurantsSnapshot, cafesSnapshot] = await Promise.all([
        getDocs(collection(db, 'restaurants')),
        getDocs(collection(db, 'cafes'))
      ]);

      // Filter restaurants for approved ones or those without status (old data)
      const restaurantsData = restaurantsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          type: 'restaurant',
          ...doc.data(),
        }))
        .filter((restaurant) => {
          // Show restaurants that are approved/active OR don't have a status field (old data)
          return !restaurant.status || restaurant.status === "active" || restaurant.status === "approved";
        });

      // Filter cafes for approved ones or those without status (old data)
      const cafesData = cafesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          type: 'cafe',
          ...doc.data(),
        }))
        .filter((cafe) => {
          // Show cafes that are approved/active OR don't have a status field (old data)
          return !cafe.status || cafe.status === "active" || cafe.status === "approved";
        });

      setRestaurants(restaurantsData);
      setCafes(cafesData);
    } catch (error) {
      console.error('Error fetching dining data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    return currentTab === 0 ? restaurants : cafes;
  };

  const filteredData = getCurrentData().filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase()) || // Backward compatibility
      item.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Infinite Scroll Pagination
  const {
    paginatedData: displayedData,
    resetPagination,
    totalItems,
    displayedItemsCount,
    loadingRef,
    hasMoreItems,
    isLoading
  } = usePagination(filteredData, 6, true); // Enable infinite scroll

  // Reset pagination when search changes or tab changes
  React.useEffect(() => {
    resetPagination();
  }, [searchQuery, currentTab, resetPagination]);

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };



  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSearchQuery(''); // Clear search when switching tabs
  };

  const handleAddNew = () => {
    if (currentTab === 0) {
      navigate('/addRestaurant');
    } else {
      navigate('/addCafe');
    }
  };

  const handleViewDetails = (item) => {
    if (item.type === 'restaurant') {
      navigate(`/restaurant/${item.id}`);
    } else {
      navigate(`/cafe/${item.id}`);
    }
  };

  const handleShare = (item) => {
    const itemUrl = `${window.location.origin}/${item.type}/${item.id}`;
    const itemType = item.type === 'restaurant' ? 'restaurant' : 'café';

    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out ${item.name} - ${item.cuisine || item.specialty} ${itemType}`,
        url: itemUrl,
      });
    } else {
      navigator.clipboard.writeText(itemUrl).then(() => {
        alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} link copied to clipboard!`);
      });
    }
  };

  return (
    <AppBarLayout
      title={currentTab === 0 ? "Restaurants" : "Cafés"}
      icon={currentTab === 0 ? <Restaurant /> : <LocalCafe />}
      count={filteredData.length}
      countLabel={currentTab === 0 ? 'Restaurants' : 'Cafés'}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem',
            }
          }}
        >
          <Tab
            icon={<Restaurant />}
            label="Restaurants"
            iconPosition="start"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                marginBottom: '0 !important'
              }
            }}
          />
          <Tab
            icon={<LocalCafe />}
            label="Cafés"
            iconPosition="start"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                marginBottom: '0 !important'
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder={`Search ${currentTab === 0 ? 'restaurants' : 'cafés'} by name, ${currentTab === 0 ? 'cuisine' : 'specialty'}, or location...`}
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }
          }
        }}
      />

      {/* Content Grid */}
      <Grid container spacing={3}>
        {displayedData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image or Placeholder */}
              {item.image ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={item.image}
                  alt={item.name}
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
                  {item.type === 'restaurant' ?
                    <Restaurant sx={{ fontSize: 48, color: 'grey.400' }} /> :
                    <LocalCafe sx={{ fontSize: 48, color: 'grey.400' }} />
                  }
                </Box>
              )}

              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textAlign: getTextDirection(item.name) === 'rtl' ? 'right' : 'left',
                    fontFamily: getFontFamily(item.name),
                    mb: 1,
                    lineHeight: 1.3,
                    color: theme.palette.text.primary
                  }}
                >
                  {item.name}
                </Typography>

                {/* Rating and Cuisine */}
                <Box sx={{ mb: 2 }}>
                  {parseFloat(item.rating) > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <Star sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: 'primary.main' }} />
                      {item.rating} rating
                    </Typography>
                  )}
                  {(item.cuisine || item.specialty) && (item.cuisine?.trim() !== '' || item.specialty?.trim() !== '') && (
                    <Typography variant="body2" color="text.secondary">
                      {item.cuisine || item.specialty}
                    </Typography>
                  )}
                </Box>

                {/* Location and Contact */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {`${item.location?.address || item.address}, ${item.location?.city || item.city}`}
                  </Typography>
                  {(item.contactInfo?.phone || item.contact?.phone || item.phone) && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {item.contactInfo?.phone || item.contact?.phone || item.phone}
                    </Typography>
                  )}
                  {item.hours && (typeof item.hours === 'string' ? item.hours.trim() !== '' : Object.values(item.hours).some(h => h && h.trim() !== '')) && (
                    <Typography variant="body2" color="text.secondary">
                      <Schedule sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {typeof item.hours === 'string' ? item.hours : 'See hours'}
                    </Typography>
                  )}
                </Box>

                {/* Description */}
                {item.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: getTextDirection(item.description) === 'rtl' ? 'right' : 'left',
                      fontFamily: getFontFamily(item.description),
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5,
                      mb: 2,
                      flex: 1
                    }}
                  >
                    {item.description}
                  </Typography>
                )}

                {/* Features and Price */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {item.type === 'cafe' && (
                    <>
                      {(item.features?.hasWifi || item.hasWifi) && (
                        <Chip
                          icon={<Wifi />}
                          label="WiFi"
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      )}
                      {(item.features?.hasOutdoorSeating || item.hasOutdoorSeating) && (
                        <Chip
                          label="Outdoor"
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                      {(item.features?.hasParking || item.hasParking) && (
                        <Chip
                          icon={<DirectionsCar />}
                          label="Parking"
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      )}
                      {(item.features?.petFriendly || item.petFriendly) && (
                        <Chip
                          icon={<Pets />}
                          label="Pet Friendly"
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </>
                  )}
                  {item.priceRange && item.priceRange.trim() !== '' && item.priceRange !== '$$' && (
                    <Chip
                      icon={<AttachMoney />}
                      label={item.priceRange}
                      size="small"
                      color="secondary"
                    />
                  )}
                </Box>

                {/* Action Button */}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleViewDetails(item)}
                  sx={{
                    textTransform: 'none',
                    mt: 'auto',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
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
      {!loading && filteredData.length > 0 && (
        <InfiniteScrollComponent
          totalItems={totalItems}
          displayedItemsCount={displayedItemsCount}
          hasMoreItems={hasMoreItems}
          loadingRef={loadingRef}
          isLoading={isLoading}
          color={currentTab === 0 ? "#4ecdc4" : "#96ceb4"}
        />
      )}

      {/* Empty State */}
      {!loading && filteredData.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
          <Avatar sx={{
            bgcolor: '#f8f9fa',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            border: '3px solid #e9ecef'
          }}>
            {currentTab === 0 ? <Restaurant sx={{ fontSize: 40, color: '#6c757d' }} /> : <LocalCafe sx={{ fontSize: 40, color: '#6c757d' }} />}
          </Avatar>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {searchQuery ? `No ${currentTab === 0 ? 'restaurants' : 'cafés'} found` : `No ${currentTab === 0 ? 'restaurants' : 'cafés'} available`}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchQuery ? 'Try adjusting your search terms' : `Be the first to add a ${currentTab === 0 ? 'restaurant' : 'café'}!`}
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label={`add ${currentTab === 0 ? 'restaurant' : 'cafe'}`}
        onClick={handleAddNew}
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

export default DiningPage;
