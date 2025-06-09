import React from 'react';
import {
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
  Avatar,
  Button,
} from "@mui/material";
import { Add, Search, LocationOn, Work, Business, Share, Visibility } from "@mui/icons-material";
import EllipsisTypography from "../pages/custom/EllipsisTypography";
import { useNavigate } from "react-router-dom";
import AppBarLayout from "../layouts/AppBarLayout";
import usePagination from '../hooks/usePagination';
import InfiniteScrollComponent from '../components/common/InfiniteScrollComponent';

const HomePage = ({ jobs, searchQuery, onSearch }) => {
  const navigate = useNavigate();

  const handleViewDetails = (job) => {
    navigate(`/job/${job.id}`);
  };

  const handleShare = (job, event) => {
    event.stopPropagation(); // Prevent card click
    const jobUrl = `${window.location.origin}/job/${job.id}`;

    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job opportunity: ${job.title}`,
        url: jobUrl,
      });
    } else {
      navigator.clipboard.writeText(jobUrl).then(() => {
        alert("Job link copied to clipboard!");
      });
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city?.toLowerCase().includes(searchQuery.toLowerCase()) || // Backward compatibility
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Infinite Scroll Pagination
  const {
    paginatedData: displayedJobs,
    resetPagination,
    totalItems,
    displayedItemsCount,
    loadingRef,
    hasMoreItems,
    isLoading
  } = usePagination(filteredJobs, 6, true); // Enable infinite scroll

  // Reset pagination when search changes
  React.useEffect(() => {
    resetPagination();
  }, [searchQuery, resetPagination]);

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
    <AppBarLayout
      title="Jobs"
      icon={<Work />}
      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      iconColor="#667eea"
      count={filteredJobs.length}
      countLabel="Available"
    >
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
          {displayedJobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                      label={`${job.location?.city || job.city}, ${job.location?.province || job.province}`}
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
                    {job.company && (
                      <Chip
                        icon={<Business />}
                        label={job.company}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: jobColors[index % jobColors.length],
                          color: jobColors[index % jobColors.length]
                        }}
                      />
                    )}
                    {job.category && job.category !== 'General' && (
                      <Chip
                        label={job.category}
                        size="small"
                        sx={{
                          bgcolor: `${jobColors[index % jobColors.length]}20`,
                          color: jobColors[index % jobColors.length],
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    {job.jobType && (
                      <Chip
                        label={job.jobType}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#6c757d',
                          color: '#6c757d'
                        }}
                      />
                    )}
                    {(job.applicationLink || job.link) && (
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

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(job)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${jobColors[index % jobColors.length]} 0%, ${jobColors[index % jobColors.length]}CC 100%)`,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${jobColors[index % jobColors.length]}40`,
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Share />}
                      onClick={(event) => handleShare(job, event)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: jobColors[index % jobColors.length],
                        color: jobColors[index % jobColors.length],
                        '&:hover': {
                          borderColor: jobColors[index % jobColors.length],
                          backgroundColor: `${jobColors[index % jobColors.length]}10`,
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
        {filteredJobs.length > 0 && (
          <InfiniteScrollComponent
            totalItems={totalItems}
            displayedItemsCount={displayedItemsCount}
            hasMoreItems={hasMoreItems}
            loadingRef={loadingRef}
            isLoading={isLoading}
            color="#667eea"
          />
        )}

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
            bottom: 120,
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
    </AppBarLayout>
  );
};

export default HomePage;