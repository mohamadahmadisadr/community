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
  useTheme
} from "@mui/material";
import {
  ArrowBack,
  Work,
  LocationOn,
  Business,
  Share,
  OpenInNew,
  CalendarToday,
  Email,
  Phone,
  AttachMoney,
  WorkOutline,
  Category
} from "@mui/icons-material";
import { db } from "../../firebaseConfig";
import { getClickableChipProps } from '../../utils/contactUtils';
import CommentsSection from '../common/CommentsSection';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
          <CircularProgress size={60} color="primary" />
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
              bgcolor: 'grey.100',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: 3,
              borderColor: 'grey.300'
            }}>
              <Work sx={{ fontSize: 40, color: 'grey.500' }} />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar with job title */}
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
              whiteSpace: 'nowrap',
              color: theme.palette.primary.contrastText
            }}
          >
            {job.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 0, pb: 10, px: 0, m: 0, flex: 1 }}>
        {/* Job Image or Placeholder */}
        {job.image ? (
          <CardMedia
            component="img"
            height="250"
            image={job.image}
            alt={job.title}
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
            <Work sx={{ fontSize: 80, color: 'grey.400' }} />
          </Box>
        )}

        {/* Job Details */}
        <Box sx={{ px: 2, pt: 2 }}>
              {/* Job Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(job.title)
                }}
              >
                {job.title}
              </Typography>

              {/* Job Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {job.company && (
                  <Chip
                    icon={<Business />}
                    label={job.company}
                    color="primary"
                  />
                )}
                {job.category && job.category !== 'General' && (
                  <Chip
                    icon={<Category />}
                    label={job.category}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {/* Job Type - support both new 'type' and legacy 'jobType' */}
                {(job.type || job.jobType) && (
                  <Chip
                    icon={<WorkOutline />}
                    label={(job.type || job.jobType).charAt(0).toUpperCase() + (job.type || job.jobType).slice(1)}
                    color="secondary"
                  />
                )}
                {/* Location */}
                {job.location?.city && job.location?.province && (
                  <Chip
                    icon={<LocationOn />}
                    label={`${job.location.city}, ${job.location.province}`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {/* Remote work indicator */}
                {job.location?.remote && (
                  <Chip
                    label="Remote Available"
                    variant="outlined"
                    color="success"
                  />
                )}
                {/* Legacy location support */}
                {!job.location?.city && (job.city || job.province) && (
                  <Chip
                    icon={<LocationOn />}
                    label={`${job.city || ''}, ${job.province || ''}`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {job.createdAt && (
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Salary Information */}
              {job.salary && (job.salary.min || job.salary.max) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    Salary Information
                  </Typography>
                  <Chip
                    icon={<AttachMoney />}
                    label={(() => {
                      const min = job.salary.min ? `$${job.salary.min.toLocaleString()}` : null;
                      const max = job.salary.max ? `$${job.salary.max.toLocaleString()}` : null;
                      const currency = job.salary.currency || 'CAD';
                      const period = job.salary.period || job.salary.type || 'yearly'; // Support both new 'period' and legacy 'type'

                      let salaryText = '';
                      if (min && max) {
                        salaryText = `${min} - ${max}`;
                      } else if (min) {
                        salaryText = `From ${min}`;
                      } else if (max) {
                        salaryText = `Up to ${max}`;
                      }

                      return `${salaryText} ${currency} ${period}`;
                    })()}
                    color="primary"
                    sx={{
                      fontSize: '1rem',
                      py: 1,
                      '& .MuiChip-icon': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                </Box>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Requirements
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.requirements.map((requirement, index) => (
                      <Chip
                        key={index}
                        label={requirement}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Benefits
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.benefits.map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Contact Information */}
              {(job.contactEmail || job.contactPhone) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.contactEmail && (
                      <Chip
                        icon={<Email />}
                        label={job.contactEmail}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          borderColor: theme.palette.info.main,
                          color: theme.palette.info.main,
                          '& .MuiChip-icon': {
                            color: theme.palette.info.main
                          },
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[2],
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                        {...getClickableChipProps('email', job.contactEmail)}
                      />
                    )}
                    {job.contactPhone && (
                      <Chip
                        icon={<Phone />}
                        label={job.contactPhone}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          borderColor: theme.palette.success.main,
                          color: theme.palette.success.main,
                          '& .MuiChip-icon': {
                            color: theme.palette.success.main
                          },
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[2],
                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                          }
                        }}
                        {...getClickableChipProps('phone', job.contactPhone)}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Job Description */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Job Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  color: theme.palette.text.primary,
                  textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
                  fontFamily: getFontFamily(job.description),
                  whiteSpace: "pre-line",
                }}
              >
                {job.description}
              </Typography>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                {/* Application Button - supports both new and legacy structures */}
                {((job.applicationUrl && job.applicationUrl.trim() !== "") ||
                  (job.applicationLink && job.applicationLink.trim() !== "") ||
                  (job.link && job.link.trim() !== "")) && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={() => {
                      const url = job.applicationUrl || job.applicationLink || job.link;
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
                    Apply Now
                  </Button>
                )}

                {/* Fallback Apply Button when no link is available */}
                {!((job.applicationUrl && job.applicationUrl.trim() !== "") ||
                   (job.applicationLink && job.applicationLink.trim() !== "") ||
                   (job.link && job.link.trim() !== "")) && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={() => alert("To apply for this job, please contact the employer directly using the contact information provided above.")}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark,
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    How to Apply
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
                itemType="job"
              />
        </Box>
      </Container>
    </Box>
  );
};

export default JobDetailPage;