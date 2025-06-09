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
  Work,
  LocationOn,
  Business,
  Share,
  OpenInNew,
  CalendarToday
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", id));
        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Helper function to determine text direction
  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "rtl" : "ltr";
  };

  // Helper function to determine font family
  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const handleApply = () => {
    const applicationUrl = job.applicationLink || job.link;
    if (applicationUrl && applicationUrl.trim() !== "") {
      window.open(applicationUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No application link available for this job.");
    }
  };

  const handleShare = () => {
    const jobUrl = `${window.location.origin}/job/${id}`;
    navigator.clipboard.writeText(jobUrl).then(() => {
      alert("Job link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* AppBar with back button */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Container>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* AppBar with back button */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Job Not Found
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
              <Work sx={{ fontSize: 40, color: '#6c757d' }} />
            </Avatar>
            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Job Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The job you're looking for doesn't exist or has been removed.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar with job title */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <Avatar sx={{ bgcolor: '#fff', color: '#667eea', mr: 2 }}>
            <Work />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
              fontFamily: getFontFamily(job.title),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {job.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Job Image */}
        {job.image && (
          <CardMedia
            component="img"
            height="250"
            image={job.image}
            alt={job.title}
            sx={{
              objectFit: "cover",
              filter: 'brightness(0.9)'
            }}
          />
        )}

        {/* Job Details Card */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '2px solid #667eea20',
              mb: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Job Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(job.title),
                  color: '#2c3e50'
                }}
              >
                {job.title}
              </Typography>

              {/* Location and Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {(job.location?.city || job.city) && (job.location?.province || job.province) && (
                  <Chip
                    icon={<LocationOn />}
                    label={`${job.location?.city || job.city}, ${job.location?.province || job.province}`}
                    sx={{
                      bgcolor: '#667eea15',
                      color: '#667eea',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: '#667eea'
                      }
                    }}
                  />
                )}
                {(job.location?.country || job.country) && (
                  <Chip
                    icon={<Business />}
                    label={job.location?.country || job.country}
                    variant="outlined"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '& .MuiChip-icon': {
                        color: '#667eea'
                      }
                    }}
                  />
                )}
                {job.company && (
                  <Chip
                    icon={<Business />}
                    label={job.company}
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
                {job.jobType && (
                  <Chip
                    label={job.jobType}
                    sx={{
                      bgcolor: '#17a2b8',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {job.category && job.category !== 'General' && (
                  <Chip
                    label={job.category}
                    variant="outlined"
                    sx={{
                      borderColor: '#fd7e14',
                      color: '#fd7e14',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {job.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
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

              {/* Salary Information */}
              {job.salary && (job.salary.min || job.salary.max) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    Salary Range
                  </Typography>
                  <Chip
                    label={`${job.salary.min ? `$${job.salary.min.toLocaleString()}` : 'N/A'} - ${job.salary.max ? `$${job.salary.max.toLocaleString()}` : 'N/A'} ${job.salary.currency || 'CAD'} ${job.salary.type || 'annually'}`}
                    sx={{
                      bgcolor: '#28a745',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 1
                    }}
                  />
                </Box>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    Requirements
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.requirements.map((requirement, index) => (
                      <Chip
                        key={index}
                        label={requirement}
                        variant="outlined"
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    Benefits
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.benefits.map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        sx={{
                          bgcolor: '#17a2b8',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Contact Information */}
              {(job.contactEmail || job.contactPhone) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.contactEmail && (
                      <Chip
                        label={job.contactEmail}
                        sx={{
                          bgcolor: '#dc3545',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backgroundColor: '#c82333'
                          }
                        }}
                        {...getClickableChipProps('email', job.contactEmail)}
                      />
                    )}
                    {job.contactPhone && (
                      <Chip
                        label={job.contactPhone}
                        sx={{
                          bgcolor: '#6f42c1',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backgroundColor: '#5a2d91'
                          }
                        }}
                        {...getClickableChipProps('phone', job.contactPhone)}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Job Description */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
                Job Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  color: "text.primary",
                  textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(job.description),
                  whiteSpace: "pre-line",
                }}
              >
                {job.description}
              </Typography>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {((job.applicationLink && job.applicationLink.trim() !== "") || (job.link && job.link.trim() !== "")) && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={handleApply}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                  >
                    Apply Now
                  </Button>
                )}

                {/* Fallback Apply Button when no link is available */}
                {!((job.applicationLink && job.applicationLink.trim() !== "") || (job.link && job.link.trim() !== "")) && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={() => alert("To apply for this job, please contact the employer directly or check the job description for application instructions.")}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                      boxShadow: '0 4px 20px rgba(108, 117, 125, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6268 0%, #3d4142 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(108, 117, 125, 0.4)',
                      }
                    }}
                  >
                    How to Apply
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
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#5a6fd8',
                      backgroundColor: '#667eea10',
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
              border: '2px solid #667eea20',
              mt: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <CommentsSection
                itemId={id}
                itemType="job"
                color="#667eea"
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default JobDetailPage;