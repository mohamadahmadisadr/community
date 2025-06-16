import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Work, Event, Restaurant, Home, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current tab based on pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/jobs') || path.startsWith('/job') || path.startsWith('/addJob')) {
      return 0;
    } else if (path.startsWith('/events') || path.startsWith('/addEvent')) {
      return 1;
    } else if (path.startsWith('/dining') || path.startsWith('/restaurants') || path.startsWith('/cafes') || path.startsWith('/addRestaurant') || path.startsWith('/addCafe')) {
      return 2;
    } else if (path.startsWith('/rent') || path.startsWith('/house') || path.startsWith('/addHouse')) {
      return 3;
    } else if (path.startsWith('/profile')) {
      return 4;
    }
    return 0; // Default to jobs
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/jobs');
        break;
      case 1:
        navigate('/events');
        break;
      case 2:
        navigate('/dining');
        break;
      case 3:
        navigate('/rent');
        break;
      case 4:
        navigate('/profile');
        break;
      default:
        navigate('/jobs');
    }
  };

  // Don't show bottom navigation on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0'
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={getCurrentTab()}
        onChange={handleChange}
        showLabels={true} // Always show labels
        sx={{
          height: 80,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '8px 12px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontWeight: 500,
            opacity: '1 !important', // Always show labels
          }
        }}
      >
        <BottomNavigationAction
          label="Jobs"
          icon={<Work />}
        />
        <BottomNavigationAction
          label="Events"
          icon={<Event />}
        />
        <BottomNavigationAction
          label="Dining"
          icon={<Restaurant />}
        />
        <BottomNavigationAction
          label="Rent"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
