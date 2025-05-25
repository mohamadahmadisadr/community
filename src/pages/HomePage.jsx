import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Fab,
  InputAdornment,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import { Add, Search, LocationOn, Work, Business } from "@mui/icons-material";
import EllipsisTypography from "../pages/custom/EllipsisTypography";
import { useNavigate } from "react-router-dom";

const HomePage = ({ jobs, searchQuery, onSearch }) => {
  const navigate = useNavigate();

  const handleViewDetails = (job) => {
    navigate(`/job/${job.id}`);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to determine text direction and font
  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "rtl" : "ltr";
  };

  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const jobColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Material Design AppBar */}
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
          <Avatar sx={{ bgcolor: '#fff', color: '#667eea', mr: 2 }}>
            <Work />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Jobs
          </Typography>
          <Chip
            label={`${filteredJobs.length} Available`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ pt: 2, pb: 2, px: 2, m: 0 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search jobs by title or city..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
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

        {/* Jobs Grid */}
        <Grid container spacing={3}>
          {filteredJobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                onClick={() => handleViewDetails(job)}
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: `2px solid ${jobColors[index % jobColors.length]}20`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                    border: `2px solid ${jobColors[index % jobColors.length]}`,
                  },
                }}
              >
                {job.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={job.image}
                    alt={job.title}
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
                        bgcolor: jobColors[index % jobColors.length],
                        width: 32,
                        height: 32,
                        mr: 2
                      }}
                    >
                      <Work sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
                        fontFamily: getFontFamily(job.title),
                        fontSize: '1.1rem',
                        flex: 1,
                        color: '#2c3e50'
                      }}
                    >
                      {job.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${job.city}, ${job.province}`}
                      size="small"
                      sx={{
                        bgcolor: `${jobColors[index % jobColors.length]}15`,
                        color: jobColors[index % jobColors.length],
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: jobColors[index % jobColors.length]
                        }
                      }}
                    />
                  </Box>

                  <EllipsisTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(job.description),
                      lineHeight: 1.6,
                      mb: 2
                    }}
                    lines={3}
                  >
                    {job.description}
                  </EllipsisTypography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.country && (
                      <Chip
                        icon={<Business />}
                        label={job.country}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: jobColors[index % jobColors.length],
                          color: jobColors[index % jobColors.length]
                        }}
                      />
                    )}
                    {job.link && (
                      <Chip
                        label="Apply Now"
                        size="small"
                        sx={{
                          bgcolor: jobColors[index % jobColors.length],
                          color: 'white',
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: jobColors[index % jobColors.length],
                            filter: 'brightness(0.9)'
                          }
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
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
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {searchQuery ? 'No jobs found' : 'No jobs available'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to post a job opportunity!'}
            </Typography>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add job"
          onClick={() => navigate('/addJob')}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
            }
          }}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default HomePage;