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
  Divider
} from "@mui/material";
import { 
  ArrowBack, 
  Event, 
  LocationOn, 
  Schedule, 
  Share, 
  OpenInNew,
  CalendarToday,
  Person,
  AttachMoney
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleRegister = () => {
    if (event.link) {
      window.open(event.link, "_blank", "noopener,noreferrer");
    }
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
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
              Event Not Found
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
              <Event sx={{ fontSize: 40, color: '#6c757d' }} />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar with event title */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
          <Avatar sx={{ bgcolor: '#fff', color: '#ff6b6b', mr: 2 }}>
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
        {/* Event Image */}
        {event.image && (
          <CardMedia
            component="img"
            height="250"
            image={event.image}
            alt={event.title}
            sx={{ 
              objectFit: "cover",
              filter: 'brightness(0.9)'
            }}
          />
        )}

        {/* Event Details Card */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #ff6b6b20',
              mb: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Event Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(event.title) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(event.title),
                  color: '#2c3e50'
                }}
              >
                {event.title}
              </Typography>

              {/* Event Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {event.category && (
                  <Chip
                    label={event.category}
                    sx={{
                      bgcolor: '#ff6b6b15',
                      color: '#ff6b6b',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {event.price && (
                  <Chip
                    icon={<AttachMoney />}
                    label={event.price === 'Free' ? 'Free' : `$${event.price}`}
                    variant="outlined"
                    sx={{
                      borderColor: event.price === 'Free' ? '#28a745' : '#ff6b6b',
                      color: event.price === 'Free' ? '#28a745' : '#ff6b6b',
                      '& .MuiChip-icon': {
                        color: event.price === 'Free' ? '#28a745' : '#ff6b6b'
                      }
                    }}
                  />
                )}
                {event.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(event.createdAt.seconds * 1000).toLocaleDateString()}
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

              {/* Event Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                  Event Information
                </Typography>
                
                {event.date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<CalendarToday />}
                      label={formatDate(event.date)}
                      variant="outlined"
                      sx={{
                        borderColor: '#ff6b6b',
                        color: '#ff6b6b',
                        '& .MuiChip-icon': {
                          color: '#ff6b6b'
                        }
                      }}
                    />
                  </Box>
                )}
                
                {event.time && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Schedule />}
                      label={formatTime(event.time)}
                      variant="outlined"
                      sx={{
                        borderColor: '#17a2b8',
                        color: '#17a2b8',
                        '& .MuiChip-icon': {
                          color: '#17a2b8'
                        }
                      }}
                    />
                  </Box>
                )}

                {event.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={event.location}
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
                      {...getClickableChipProps('address', event.location)}
                    />
                  </Box>
                )}

                {event.organizer && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Person />}
                      label={`Organized by ${event.organizer}`}
                      variant="outlined"
                      sx={{
                        borderColor: '#6f42c1',
                        color: '#6f42c1',
                        '& .MuiChip-icon': {
                          color: '#6f42c1'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Description */}
              {event.description && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
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
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {event.link && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={handleRegister}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff5252 0%, #d84315 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(255, 107, 107, 0.4)',
                      }
                    }}
                  >
                    Register Now
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
                    borderColor: '#ff6b6b',
                    color: '#ff6b6b',
                    '&:hover': {
                      borderColor: '#ff5252',
                      backgroundColor: '#ff6b6b10',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Share
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Comments Section - Separate Card */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #ff6b6b20',
              mt: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <CommentsSection
                itemId={id}
                itemType="event"
                color="#ff6b6b"
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default EventDetailPage;
