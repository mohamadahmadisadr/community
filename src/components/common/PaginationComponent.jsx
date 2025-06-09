import { 
  Box, 
  Button, 
  Typography, 
  Pagination,
  Stack,
  Chip
} from '@mui/material';
import { 
  KeyboardArrowLeft, 
  KeyboardArrowRight, 
  ExpandMore 
} from '@mui/icons-material';

const PaginationComponent = ({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange, 
  onLoadMore, 
  totalItems, 
  startIndex, 
  endIndex,
  showLoadMore = true,
  showPagination = true,
  color = '#667eea'
}) => {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      {/* Items info */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Chip
          label={`Showing ${startIndex}-${endIndex} of ${totalItems} items`}
          variant="outlined"
          sx={{
            borderColor: color,
            color: color,
            fontWeight: 'bold'
          }}
        />
      </Box>

      {/* Load More Button (Lazy Loading Style) */}
      {showLoadMore && hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            onClick={onLoadMore}
            startIcon={<ExpandMore />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              boxShadow: `0 4px 20px ${color}40`,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: `linear-gradient(135deg, ${color}DD 0%, ${color}AA 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${color}50`,
              }
            }}
          >
            Load More ({totalPages - currentPage} pages remaining)
          </Button>
        </Box>
      )}

      {/* Traditional Pagination */}
      {showPagination && (
        <Stack spacing={2} alignItems="center">
          {/* Page Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              startIcon={<KeyboardArrowLeft />}
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  borderColor: color,
                  backgroundColor: `${color}10`,
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#bdbdbd',
                }
              }}
            >
              Previous
            </Button>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => onPageChange(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: color,
                  borderColor: color,
                  '&.Mui-selected': {
                    backgroundColor: color,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: `${color}DD`,
                    }
                  },
                  '&:hover': {
                    backgroundColor: `${color}10`,
                  }
                }
              }}
            />

            <Button
              variant="outlined"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNextPage}
              endIcon={<KeyboardArrowRight />}
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  borderColor: color,
                  backgroundColor: `${color}10`,
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#bdbdbd',
                }
              }}
            >
              Next
            </Button>
          </Box>

          {/* Page Info */}
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default PaginationComponent;
