import { Box, AppBar, Toolbar, Avatar, Typography, Chip, Container } from '@mui/material';

const AppBarLayout = ({
  title,
  icon,
  gradient,
  iconColor,
  count,
  countLabel,
  children
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Material Design AppBar */}
      <AppBar
        position="static"
        sx={{
          background: gradient,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          m: 0,
          p: 0
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: '#fff', color: iconColor, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
          {count !== undefined && (
            <Chip
              label={`${count} ${countLabel}`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth={false} sx={{ pt: 2, pb: 8, px: 2, m: 0, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppBarLayout;
