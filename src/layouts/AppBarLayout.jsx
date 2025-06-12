import { Box, AppBar, Toolbar, Avatar, Typography, Chip, Container, useTheme } from '@mui/material';

const AppBarLayout = ({
  title,
  icon,
  count,
  countLabel,
  children
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Material Design AppBar - uses theme colors */}
      <AppBar
        position="static"
        color="primary"
        sx={{
          m: 0,
          p: 0
        }}
      >
        <Toolbar>
          <Avatar sx={{
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            mr: 2,
            border: `1px solid ${theme.palette.primary.dark}`
          }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: theme.palette.primary.contrastText
          }}>
            {title}
          </Typography>
          {count !== undefined && (
            <Chip
              label={`${count} ${countLabel}`}
              sx={{
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                fontWeight: 500,
                border: `1px solid ${theme.palette.primary.dark}`
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth={false} sx={{ pt: 2, pb: 10, px: 2, m: 0, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppBarLayout;
