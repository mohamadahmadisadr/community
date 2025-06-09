import { 
  Box, 
  Typography, 
  Chip,
  CircularProgress,
  Fade
} from '@mui/material';
import { 
  ExpandMore 
} from '@mui/icons-material';

const InfiniteScrollComponent = ({
  totalItems,
  displayedItemsCount,
  hasMoreItems,
  loadingRef,
  isLoading = false,
  color = '#667eea'
}) => {
  if (totalItems <= 0) return null;

  return (
    <Box sx={{ mt: 4, mb: 2 }}>

      {/* Loading indicator and intersection observer target */}
      {hasMoreItems && (
        <Box
          ref={loadingRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 3,
            minHeight: 60,
            width: '100%'
          }}
        >
          {isLoading ? (
            <Fade in={true}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress
                  size={24}
                  sx={{
                    color: color
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: color,
                    fontWeight: 'medium'
                  }}
                >
                  Loading more items...
                </Typography>
              </Box>
            </Fade>
          ) : (
            <Box sx={{ height: 20 }} /> // Invisible trigger area
          )}
        </Box>
      )}




    </Box>
  );
};

export default InfiniteScrollComponent;
