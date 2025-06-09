import { createTheme } from '@mui/material/styles';

// Telegram Mini App theme configuration - preserves colorful UI
const telegramTheme = createTheme({
  palette: {
    mode: 'light', // Force light mode
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff', // Only fix background
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Only fix text color
      secondary: '#666666',
    },
  },
  components: {
    // Only override background and text, preserve all colors
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff !important',
          color: '#000000 !important',
        },
        html: {
          backgroundColor: '#ffffff !important',
        },
        '#root': {
          backgroundColor: '#ffffff !important',
        },
      },
    },
    // Don't override AppBar - let gradients work
    MuiPaper: {
      styleOverrides: {
        root: {
          // Only override if it's the bottom navigation or main containers
          '&.MuiPaper-root:not(.MuiCard-root):not(.MuiAppBar-root)': {
            backgroundColor: '#ffffff !important',
          },
        },
      },
    },
    // Don't override Cards - let them keep their colors
  },
});

export default telegramTheme;
