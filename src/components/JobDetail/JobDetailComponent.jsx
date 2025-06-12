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
              whiteSpace: 'nowrap'
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

              {/* Location and Details */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {(job.location?.city || job.city) && (job.location?.province || job.province) && (
                  <Chip
                    icon={<LocationOn />}
                    label={`${job.location?.city || job.city}, ${job.location?.province || job.province}`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {(job.location?.country || job.country) && (
                  <Chip
                    icon={<Business />}
                    label={job.location?.country || job.country}
                    variant="outlined"
                    color="primary"
                  />
                )}
                {job.company && (
                  <Chip
                    icon={<Business />}
                    label={job.company}
                    color="primary"
                  />
                )}
                {job.jobType && (
                  <Chip
                    label={job.jobType}
                    color="secondary"
                  />
                )}
                {job.category && job.category !== 'General' && (
                  <Chip
                    label={job.category}
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
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Salary Range
                  </Typography>
                  <Chip
                    label={`${job.salary.min ? `$${job.salary.min.toLocaleString()}` : 'N/A'} - ${job.salary.max ? `$${job.salary.max.toLocaleString()}` : 'N/A'} ${job.salary.currency || 'CAD'} ${job.salary.type || 'annually'}`}
                    color="primary"
                    sx={{
                      fontSize: '1rem',
                      py: 1
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
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.contactEmail && (
                      <Chip
                        label={job.contactEmail}
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        {...getClickableChipProps('email', job.contactEmail)}
                      />
                    )}
                    {job.contactPhone && (
                      <Chip
                        label={job.contactPhone}
                        color="secondary"
                        sx={{ cursor: 'pointer' }}
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
                      fontWeight: 500,
                      textTransform: "none"
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
                    fontWeight: 500,
                    textTransform: "none"
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