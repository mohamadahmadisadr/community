import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const AppBarLayout = ({ title, icon, count, countLabel, children }) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ ml: 2 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {count} {countLabel}
          </Typography>
        </Box>
      </Toolbar>
      {children}
    </AppBar>
  );
};

export default AppBarLayout; 