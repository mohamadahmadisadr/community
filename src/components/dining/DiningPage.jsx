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
import { Add, Search, LocationOn, Phone, Schedule, Wifi, Restaurant, LocalCafe, Star, AttachMoney, DirectionsCar, Pets, Share, Visibility } from '@mui/icons-material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import AppBarLayout from '../../layouts/AppBarLayout';
import usePagination from '../../hooks/usePagination';
import InfiniteScrollComponent from '../../components/common/InfiniteScrollComponent';
import { getClickableChipProps } from '../../utils/contactUtils';

const DiningPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

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

  const diningColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF8A80'];

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
      gradient={currentTab === 0 ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)" : "linear-gradient(135deg, #96ceb4 0%, #ffeaa7 100%)"}
      iconColor={currentTab === 0 ? "#4ecdc4" : "#96ceb4"}
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
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: '#4ecdc4 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4ecdc4',
              height: 3,
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
            borderRadius: 3,
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
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `2px solid ${diningColors[index % diningColors.length]}20`,
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                  border: `2px solid ${diningColors[index % diningColors.length]}`,
                },
              }}
            >
              {item.image && (
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt={item.name}
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
                      bgcolor: diningColors[index % diningColors.length],
                      width: 32,
                      height: 32,
                      mr: 2
                    }}
                  >
                    {item.type === 'restaurant' ? <Restaurant sx={{ fontSize: 18 }} /> : <LocalCafe sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: getTextDirection(item.name) === 'rtl' ? 'right' : 'left',
                      fontFamily: getFontFamily(item.name),
                      fontSize: '1.1rem',
                      flex: 1,
                      color: '#2c3e50'
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>

                {parseFloat(item.rating) > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={parseFloat(item.rating)} readOnly size="small" />
                    <Chip
                      icon={<Star />}
                      label={item.rating}
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

                {(item.cuisine || item.specialty) && (item.cuisine?.trim() !== '' || item.specialty?.trim() !== '') && (
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={item.cuisine || item.specialty}
                      size="small"
                      sx={{
                        bgcolor: `${diningColors[index % diningColors.length]}15`,
                        color: diningColors[index % diningColors.length],
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    icon={<LocationOn />}
                    label={`${item.location?.address || item.address}, ${item.location?.city || item.city}`}
                    size="small"
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
                    {...getClickableChipProps('address', item.location?.address || item.address, item.location?.city || item.city)}
                  />
                </Box>

                {(item.contactInfo?.phone || item.contact?.phone || item.phone) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Phone />}
                      label={item.contactInfo?.phone || item.contact?.phone || item.phone}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: diningColors[index % diningColors.length],
                        color: diningColors[index % diningColors.length],
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiChip-icon': {
                          color: diningColors[index % diningColors.length]
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          backgroundColor: `${diningColors[index % diningColors.length]}10`
                        }
                      }}
                      {...getClickableChipProps('phone', item.contactInfo?.phone || item.contact?.phone || item.phone)}
                    />
                  </Box>
                )}

                {item.hours && (typeof item.hours === 'string' ? item.hours.trim() !== '' : Object.values(item.hours).some(h => h && h.trim() !== '')) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<Schedule />}
                      label={typeof item.hours === 'string' ? item.hours : 'See hours'}
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
                      lineHeight: 1.6,
                      mb: 2
                    }}
                  >
                    {item.description}
                  </Typography>
                )}

                {/* Features for cafes */}
                {item.type === 'cafe' && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {(item.features?.hasWifi || item.hasWifi) && (
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
                    {(item.features?.hasOutdoorSeating || item.hasOutdoorSeating) && (
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
                    {(item.features?.hasParking || item.hasParking) && (
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
                    {(item.features?.petFriendly || item.petFriendly) && (
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
                )}

                {item.priceRange && item.priceRange.trim() !== '' && item.priceRange !== '$$' && (
                  <Chip
                    icon={<AttachMoney />}
                    label={item.priceRange}
                    size="small"
                    sx={{
                      bgcolor: diningColors[index % diningColors.length],
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(item)}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${diningColors[index % diningColors.length]} 0%, ${diningColors[index % diningColors.length]}CC 100%)`,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${diningColors[index % diningColors.length]}40`,
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Share />}
                    onClick={() => handleShare(item)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: diningColors[index % diningColors.length],
                      color: diningColors[index % diningColors.length],
                      '&:hover': {
                        borderColor: diningColors[index % diningColors.length],
                        backgroundColor: `${diningColors[index % diningColors.length]}10`,
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    Share
                  </Button>
                </Box>
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
          zIndex: 1000,
          background: 'linear-gradient(135deg, #4ecdc4 0%, #96ceb4 100%)',
          boxShadow: '0 8px 32px rgba(78, 205, 196, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #26d0ce 0%, #74b9a0 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(78, 205, 196, 0.6)',
          }
        }}
      >
        <Add />
      </Fab>
    </AppBarLayout>
  );
};

export default DiningPage;
