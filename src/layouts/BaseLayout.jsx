import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const BaseLayout = ({ children }) => {
  const location = useLocation();

  // Pages that should not show bottom navigation
  const hideBottomNavPages = ['/login', '/register', '/about'];
  const shouldShowBottomNav = !hideBottomNavPages.includes(location.pathname);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      m: 0,
      p: 0,
      width: '100%'
    }}>
      {/* Main content area */}
      <Box sx={{
        flex: 1,
        m: 0,
        p: 0
      }}>
        {children}
      </Box>

      {/* Spacer for bottom navigation */}
      {shouldShowBottomNav && (
        <Box sx={{ height: '80px', width: '100%' }} />
      )}

      {/* Bottom Navigation - only show on main app pages */}
      {shouldShowBottomNav && <BottomNavigation />}
    </Box>
  );
};

export default BaseLayout;
