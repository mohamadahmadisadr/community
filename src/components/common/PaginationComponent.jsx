import { 
  Box, 
  Button, 
  Typography, 
  Pagination,
  Stack,
  Chip,
  useTheme
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
}) => {
  const theme = useTheme();

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      {/* Items info */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Chip
          label={`Showing ${startIndex}-${endIndex} of ${totalItems} items`}
          variant="outlined"
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main}CC 100%)`,
              boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}DD 0%, ${theme.palette.primary.main}AA 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${theme.palette.primary.main}50`,
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
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: `${theme.palette.primary.main}10`,
                },
                '&:disabled': {
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
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
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}DD`,
                    }
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
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
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: `${theme.palette.primary.main}10`,
                },
                '&:disabled': {
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
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
