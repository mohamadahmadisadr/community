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
  Divider
} from "@mui/material";
import {
  ArrowBack,
  Event,
  LocationOn,
  Share,
  OpenInNew,
  CalendarToday,
  Person,
  AttachMoney,
  Email,
  Phone,
  Language,
  Group,
  AccessTime
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';
import { useTheme } from '@mui/material/styles';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
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

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/event/${id}`;
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

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getLocationDisplay = (event) => {
    if (event.location?.isOnline) {
      return 'Online Event';
    } else if (event.location?.venue) {
      // New database structure
      const parts = [event.location.venue];
      if (event.location.city) parts.push(event.location.city);
      if (event.location.province) parts.push(event.location.province);
      return parts.join(', ');
    } else if (event.location?.name) {
      // Legacy structure
      const parts = [event.location.name];
      if (event.location.city) parts.push(event.location.city);
      return parts.join(', ');
    } else if (typeof event.location === 'string') {
      // Very old structure
      return event.location;
    }
    return '';
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
          <CircularProgress size={60} sx={{ color: '#ff6b6b' }} />
        </Container>
      </Box>
    );
  }

  if (!event) {
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
              Event Not Found
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
              <Event sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
            </Avatar>
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Event Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The event you're looking for doesn't exist or has been removed.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar with event title */}
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
            <Event />
          </Avatar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              textAlign: getTextDirection(event.title) === "rtl" ? "right" : "left",
              fontFamily: getFontFamily(event.title),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {event.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Event Image or Placeholder */}
        {event.image ? (
          <CardMedia
            component="img"
            height="250"
            image={event.image}
            alt={event.title}
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
            <Event sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}

        {/* Event Details */}
        <Box sx={{ px: 2, pt: 2 }}>
              {/* Event Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(event.title) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(event.title),
                  color: theme.palette.text.primary
                }}
              >
                {event.title}
              </Typography>

              {/* Event Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {event.category && (
                  <Chip
                    label={event.category}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {/* Price/Ticket Information */}
                {(() => {
                  // Determine price display - prioritize new ticketPrice field
                  let priceDisplay = null;
                  let isFree = false;

                  if (event.ticketPrice !== undefined && event.ticketPrice !== null) {
                    // New database structure
                    isFree = event.ticketPrice === 0;
                    priceDisplay = isFree ? 'Free' : `$${event.ticketPrice}`;
                  } else if (event.price) {
                    // Legacy structure
                    isFree = event.price === 'Free' || event.price === '0' || event.price === 0;
                    priceDisplay = isFree ? 'Free' : `$${event.price}`;
                  }

                  return priceDisplay ? (
                    <Chip
                      icon={<AttachMoney />}
                      label={priceDisplay}
                      variant="outlined"
                      color={isFree ? "success" : "secondary"}
                    />
                  ) : null;
                })()}
                {/* Capacity Information */}
                {event.maxAttendees && (
                  <Chip
                    icon={<Group />}
                    label={`Max: ${event.maxAttendees}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                )}
                {event.attendees !== undefined && (
                  <Chip
                    icon={<Group />}
                    label={`${event.attendees} registered`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Event Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                  Event Information
                </Typography>

                {/* Date and Time */}
                {(event.eventDate || event.date) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<CalendarToday />}
                      label={formatDate(event.eventDate || event.date)}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                )}

                {/* End Date if different */}
                {event.endDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<CalendarToday />}
                      label={`Ends: ${formatDate(event.endDate)}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Start Time */}
                {(event.eventTime || event.time) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<AccessTime />}
                      label={formatTime(event.eventTime || event.time)}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.info.main,
                        color: theme.palette.info.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.info.main
                        }
                      }}
                    />
                  </Box>
                )}

                {/* End Time */}
                {event.endTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<AccessTime />}
                      label={`Ends: ${formatTime(event.endTime)}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: theme.palette.info.light,
                        color: theme.palette.info.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.info.main
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    icon={<LocationOn />}
                    label={getLocationDisplay(event)}
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.text.secondary,
                      color: theme.palette.text.secondary,
                      cursor: event.location?.isOnline ? 'default' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '& .MuiChip-icon': {
                        color: theme.palette.text.secondary
                      },
                      '&:hover': !event.location?.isOnline ? {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[2],
                        backgroundColor: 'rgba(108, 117, 125, 0.1)'
                      } : {}
                    }}
                    {...(!event.location?.isOnline && event.location?.address ?
                      getClickableChipProps('address', event.location.address) : {})}
                  />
                </Box>

                {/* Online Link for Online Events */}
                {event.location?.isOnline && event.location?.onlineLink && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Language />}
                      label="Join Online"
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
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                      }}
                      onClick={() => window.open(event.location.onlineLink, '_blank')}
                    />
                  </Box>
                )}

                {/* Organizer */}
                {event.organizer && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Person />}
                      label={`Organized by ${event.organizer}`}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.secondary.main
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Contact Information */}
              {(event.contactEmail || event.contactPhone) && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {event.contactEmail && (
                      <Chip
                        icon={<Email />}
                        label={event.contactEmail}
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
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                        {...getClickableChipProps('email', event.contactEmail)}
                      />
                    )}
                    {event.contactPhone && (
                      <Chip
                        icon={<Phone />}
                        label={event.contactPhone}
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
                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                          }
                        }}
                        {...getClickableChipProps('phone', event.contactPhone)}
                      />
                    )}
                  </Box>
                </>
              )}

              {/* Description */}
              {event.description && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    About This Event
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      lineHeight: 1.8,
                      color: "text.primary",
                      textAlign: getTextDirection(event.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(event.description),
                      whiteSpace: "pre-line",
                    }}
                  >
                    {event.description}
                  </Typography>
                </>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                {/* Registration Button - supports both new and legacy structures */}
                {(event.registrationUrl || event.link) && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={() => {
                      const url = event.registrationUrl || event.link;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                  >
                    Register Now
                  </Button>
                )}

                {/* Online Event Join Button */}
                {event.location?.isOnline && event.location?.onlineLink && (
                  <Button
                    variant="contained"
                    startIcon={<Language />}
                    onClick={() => window.open(event.location.onlineLink, "_blank", "noopener,noreferrer")}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: theme.palette.success.main,
                      color: theme.palette.success.contrastText,
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        bgcolor: theme.palette.success.dark,
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                  >
                    Join Online
                  </Button>
                )}

                {/* Share Button */}
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
                    borderRadius: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.primary.main + '10',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>

              {/* Comments Section */}
              <CommentsSection
                itemId={id}
                itemType="event"
              />
        </Box>
      </Container>
    </Box>
  );
};

export default EventDetailPage;
