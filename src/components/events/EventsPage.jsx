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
} from '@mui/material';
import { Add, Search, CalendarToday, LocationOn, Event, AccessTime, AttachMoney, Share, Visibility } from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import usePagination from '../../hooks/usePagination';
import InfiniteScrollComponent from '../../components/common/InfiniteScrollComponent';
import { getClickableChipProps } from '../../utils/contactUtils';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Get all events and filter for approved ones or those without status (old data)
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((event) => {
          // Show events that are approved/active OR don't have a status field (old data)
          return !event.status || event.status === "active" || event.status === "approved";
        });
      setEvents(eventsData);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) || // Backward compatibility
      event.city?.toLowerCase().includes(searchQuery.toLowerCase()) || // Backward compatibility
      event.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Infinite Scroll Pagination
  const {
    paginatedData: displayedEvents,
    resetPagination,
    totalItems,
    displayedItemsCount,
    loadingRef,
    hasMoreItems,
    isLoading
  } = usePagination(filteredEvents, 6, true); // Enable infinite scroll

  // Reset pagination when search changes
  React.useEffect(() => {
    resetPagination();
  }, [searchQuery, resetPagination]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'rtl' : 'ltr';
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const eventColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF8A80'];

  const handleViewDetails = (event) => {
    navigate(`/event/${event.id}`);
  };

  const handleShare = (event) => {
    const eventUrl = `${window.location.origin}/event/${event.id}`;

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: eventUrl,
      });
    } else {
      navigator.clipboard.writeText(eventUrl).then(() => {
        alert("Event link copied to clipboard!");
      });
    }
  };

  return (
    <AppBarLayout
      title="Events"
      icon={<Event />}
      gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
      iconColor="#ff6b6b"
      count={filteredEvents.length}
      countLabel="Events"
    >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search events by title or location..."
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

        {/* Events Grid */}
        <Grid container spacing={3}>
          {displayedEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid ${eventColors[index % eventColors.length]}20`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                    border: `2px solid ${eventColors[index % eventColors.length]}`,
                  },
                }}
              >
                {event.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.image}
                    alt={event.title}
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
                        bgcolor: eventColors[index % eventColors.length],
                        width: 32,
                        height: 32,
                        mr: 2
                      }}
                    >
                      <Event sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: getTextDirection(event.title) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(event.title),
                        fontSize: '1.1rem',
                        flex: 1,
                        color: '#2c3e50'
                      }}
                    >
                      {event.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<CalendarToday />}
                      label={formatDate(event.date)}
                      size="small"
                      sx={{
                        bgcolor: `${eventColors[index % eventColors.length]}15`,
                        color: eventColors[index % eventColors.length],
                        fontWeight: 'bold',
                        mr: 1,
                        '& .MuiChip-icon': {
                          color: eventColors[index % eventColors.length]
                        }
                      }}
                    />
                    {event.time && (
                      <Chip
                        icon={<AccessTime />}
                        label={event.time}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: eventColors[index % eventColors.length],
                          color: eventColors[index % eventColors.length],
                          '& .MuiChip-icon': {
                            color: eventColors[index % eventColors.length]
                          }
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${event.location?.name || event.location}, ${event.location?.city || event.city}`}
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
                      {...getClickableChipProps('address', event.location?.name || event.location, event.location?.city || event.city)}
                    />
                  </Box>

                  {event.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: getTextDirection(event.description) === 'rtl' ? 'right' : 'left',
                        fontFamily: getFontFamily(event.description),
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      {event.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {event.category && (
                      <Chip
                        label={event.category}
                        size="small"
                        sx={{
                          bgcolor: `${eventColors[index % eventColors.length]}20`,
                          color: eventColors[index % eventColors.length],
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    {event.price && (
                      <Chip
                        icon={<AttachMoney />}
                        label={event.price === 'Free' ? 'Free' : `$${event.price}`}
                        size="small"
                        color={event.price === 'Free' ? 'success' : 'primary'}
                        sx={{
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            fontSize: 16
                          }
                        }}
                      />
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(event)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${eventColors[index % eventColors.length]} 0%, ${eventColors[index % eventColors.length]}CC 100%)`,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${eventColors[index % eventColors.length]}40`,
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Share />}
                      onClick={() => handleShare(event)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: eventColors[index % eventColors.length],
                        color: eventColors[index % eventColors.length],
                        '&:hover': {
                          borderColor: eventColors[index % eventColors.length],
                          backgroundColor: `${eventColors[index % eventColors.length]}10`,
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
        {!loading && filteredEvents.length > 0 && (
          <InfiniteScrollComponent
            totalItems={totalItems}
            displayedItemsCount={displayedItemsCount}
            hasMoreItems={hasMoreItems}
            loadingRef={loadingRef}
            isLoading={isLoading}
            color="#ff6b6b"
          />
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Avatar sx={{
              bgcolor: '#f8f9fa',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: '3px solid #e9ecef'
            }}>
              <Event sx={{ fontSize: 40, color: '#6c757d' }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {searchQuery ? 'No events found' : 'No events available'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create an event!'}
            </Typography>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add event"
          onClick={() => navigate('/addEvent')}
          sx={{
            position: 'fixed',
            bottom: 120,
            right: 16,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5252 0%, #d84315 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(255, 107, 107, 0.6)',
            }
          }}
        >
          <Add />
        </Fab>
    </AppBarLayout>
  );
};

export default EventsPage;
