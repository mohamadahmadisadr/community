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
import { Add, Search, LocationOn, Work, Visibility } from "@mui/icons-material";
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



  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // New database structure
      job.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Legacy structure
      job.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Job type search (both new and legacy)
      job.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Requirements and benefits search
      job.requirements?.some(req => req.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.benefits?.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()))
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



  return (
    <AppBarLayout
      title="Jobs"
      icon={<Work />}
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
            mb: 3
          }}
        />

        {/* Jobs Grid */}
        <Grid container spacing={3}>
          {displayedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image or Placeholder */}
                {job.image ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={job.image}
                    alt={job.title}
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
                    <Work sx={{ fontSize: 48, color: 'grey.400' }} />
                  </Box>
                )}

                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(job.title),
                      mb: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {job.title}
                  </Typography>

                  {/* Company and Location */}
                  <Box sx={{ mb: 2 }}>
                    {job.company && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {job.company}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {`${job.location?.city || job.city}, ${job.location?.province || job.province}`}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <EllipsisTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
                      fontFamily: getFontFamily(job.description),
                      lineHeight: 1.5,
                      mb: 2,
                      flex: 1
                    }}
                    lines={3}
                  >
                    {job.description}
                  </EllipsisTypography>

                  {/* Job Details */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {/* Job Type - support both new 'type' and legacy 'jobType' */}
                    {(job.type || job.jobType) && (
                      <Chip
                        label={(job.type || job.jobType).charAt(0).toUpperCase() + (job.type || job.jobType).slice(1)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                    {job.category && job.category !== 'General' && (
                      <Chip
                        label={job.category}
                        size="small"
                        color="secondary"
                      />
                    )}
                    {/* Remote work indicator */}
                    {job.location?.remote && (
                      <Chip
                        label="Remote"
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                    )}
                    {/* Salary range if available */}
                    {job.salary && (job.salary.min || job.salary.max) && (
                      <Chip
                        label={(() => {
                          const min = job.salary.min ? `$${job.salary.min.toLocaleString()}` : null;
                          const max = job.salary.max ? `$${job.salary.max.toLocaleString()}` : null;

                          if (min && max) {
                            return `$${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}`;
                          } else if (min) {
                            return `From $${job.salary.min.toLocaleString()}`;
                          } else if (max) {
                            return `Up to $${job.salary.max.toLocaleString()}`;
                          }
                          return '';
                        })()}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    )}
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(job)}
                    sx={{
                      textTransform: 'none',
                      mt: 'auto'
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
        {filteredJobs.length > 0 && (
          <InfiniteScrollComponent
            totalItems={totalItems}
            displayedItemsCount={displayedItemsCount}
            hasMoreItems={hasMoreItems}
            loadingRef={loadingRef}
            isLoading={isLoading}
            color="primary.main"
          />
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
            <Avatar sx={{
              bgcolor: 'background.paper',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: 3,
              borderColor: 'grey.200'
            }}>
              <Work sx={{ fontSize: 40, color: 'text.secondary' }} />
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
            zIndex: 1000
          }}
        >
          <Add />
        </Fab>
    </AppBarLayout>
  );
};

export default HomePage;