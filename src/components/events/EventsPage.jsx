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
  useTheme
} from '@mui/material';
import { Add, Search, CalendarToday, LocationOn, Event, AccessTime, AttachMoney, Visibility } from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import usePagination from '../../hooks/usePagination';
import InfiniteScrollComponent from '../../components/common/InfiniteScrollComponent';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

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
      event.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // New database structure
      event.location?.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Legacy structure
      event.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';

    // Handle both Firestore timestamp and regular Date objects
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

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

  const handleViewDetails = (event) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <AppBarLayout
      title="Events"
      icon={<Event />}
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
            mb: 3
          }}
        />

        {/* Events Grid */}
        <Grid container spacing={3}>
          {displayedEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image or Placeholder */}
                {event.image ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={event.image}
                    alt={event.title}
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
                    <Event sx={{ fontSize: 48, color: 'grey.400' }} />
                  </Box>
                )}

                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      textAlign: getTextDirection(event.title) === 'rtl' ? 'right' : 'left',
                      fontFamily: getFontFamily(event.title),
                      mb: 1,
                      lineHeight: 1.3,
                      color: theme.palette.text.primary
                    }}
                  >
                    {event.title}
                  </Typography>



                  {/* Date, Time and Location */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: theme.palette.text.secondary }} />
                      {formatDate(event.eventDate || event.date)}
                      {(event.eventTime || event.time) && (
                        <>
                          {' • '}
                          <AccessTime sx={{ fontSize: 16, mx: 0.5, verticalAlign: 'middle', color: theme.palette.text.secondary }} />
                          {event.eventTime || event.time}
                        </>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: theme.palette.text.secondary }} />
                      {event.location?.isOnline ? 'Online Event' :
                       event.location?.venue ? `${event.location.venue}, ${event.location.city || ''}` :
                       event.location?.name ? `${event.location.name}, ${event.location.city || event.city || ''}` :
                       typeof event.location === 'string' ? event.location : 'Location TBD'}
                    </Typography>
                  </Box>

                  {/* Description */}
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
                        lineHeight: 1.5,
                        mb: 2,
                        flex: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {event.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {event.category && (
                      <Chip
                        label={event.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main
                        }}
                      />
                    )}
                    {(() => {
                      // Determine price display - prioritize new ticketPrice field
                      let priceDisplay = null;
                      let isFree = false;

                      if (event.ticketPrice !== undefined && event.ticketPrice !== null) {
                        // New database structure
                        isFree = event.ticketPrice === 0;
                        priceDisplay = isFree ? 'Free' : `$${event.ticketPrice}`;
                      } else if (event.price && event.price !== '') {
                        // Legacy structure
                        isFree = event.price === 'Free' || event.price === '0' || event.price === 0;
                        priceDisplay = isFree ? 'Free' : `$${event.price}`;
                      }

                      return priceDisplay ? (
                        <Chip
                          icon={!isFree ? <AttachMoney /> : undefined}
                          label={priceDisplay}
                          size="small"
                          color={isFree ? "success" : "primary"}
                          sx={{
                            fontWeight: 'bold',
                            '& .MuiChip-icon': {
                              fontSize: 16
                            },
                            bgcolor: isFree ? theme.palette.success.light : theme.palette.primary.light,
                            borderColor: isFree ? theme.palette.success.main : theme.palette.primary.main,
                            color: isFree ? theme.palette.success.contrastText : theme.palette.primary.contrastText
                          }}
                        />
                      ) : null;
                    })()}
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(event)}
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
              bgcolor: theme.palette.background.paper,
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: `3px solid ${theme.palette.divider}`
            }}>
              <Event sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
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
            zIndex: 1000
          }}
        >
          <Add />
        </Fab>
    </AppBarLayout>
  );
};

export default EventsPage;
