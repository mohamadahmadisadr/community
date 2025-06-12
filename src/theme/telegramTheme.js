import { createTheme } from '@mui/material/styles';

// Modern minimal theme with proper light/dark mode support
export const createModernTheme = (mode = 'light') => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb', // Modern blue
        light: '#3b82f6',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#64748b', // Modern slate
        light: '#94a3b8',
        dark: '#475569',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#ffffff' : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: isLight ? '#0f172a' : '#f8fafc',
        secondary: isLight ? '#64748b' : '#94a3b8',
      },
      divider: isLight ? '#e2e8f0' : '#334155',
      action: {
        hover: isLight ? '#f1f5f9' : '#334155',
        selected: isLight ? '#e2e8f0' : '#475569',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 8, // Material Design standard
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            // CSS custom properties for consistent theming
            '--primary-main': '#2563eb',
            '--primary-dark': '#1d4ed8',
            '--primary-light': '#3b82f6',
            '--secondary-main': '#64748b',
            '--secondary-dark': '#475569',
            '--secondary-light': '#94a3b8',
            '--background-default': isLight ? '#ffffff' : '#0f172a',
            '--background-paper': isLight ? '#ffffff' : '#1e293b',
            '--text-primary': isLight ? '#0f172a' : '#f8fafc',
            '--text-secondary': isLight ? '#64748b' : '#94a3b8',
            '--divider': isLight ? '#e2e8f0' : '#334155',
            // MUI CSS variables for compatibility
            '--mui-palette-primary-main': '#2563eb',
            '--mui-palette-secondary-main': '#64748b',
            '--mui-palette-background-default': isLight ? '#ffffff' : '#0f172a',
            '--mui-palette-background-paper': isLight ? '#ffffff' : '#1e293b',
            '--mui-palette-text-primary': isLight ? '#0f172a' : '#f8fafc',
            '--mui-palette-text-secondary': isLight ? '#64748b' : '#94a3b8',
          },
          body: {
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
            color: isLight ? '#0f172a' : '#f8fafc',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
          html: {
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
          },
          '#root': {
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
            minHeight: '100vh',
          },
          // Ensure all text is visible
          '*': {
            boxSizing: 'border-box',
          },
          // Fix any remaining invisible text
          'h1, h2, h3, h4, h5, h6, p, span, div': {
            color: 'inherit',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8, // Material Design standard
            boxShadow: isLight
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
            border: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
            transition: 'background-color 0.3s ease, border-color 0.3s ease', // Remove hover animations
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              transform: 'none',
            },
          },
          contained: {
            '&:disabled': {
              backgroundColor: isLight ? '#e2e8f0' : '#475569',
              color: isLight ? '#94a3b8' : '#64748b',
            },
          },
          outlined: {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: isLight ? 'rgba(37, 99, 235, 0.04)' : 'rgba(37, 99, 235, 0.08)',
            },
            '&:disabled': {
              borderColor: isLight ? '#e2e8f0' : '#475569',
              color: isLight ? '#94a3b8' : '#64748b',
            },
          },
          text: {
            '&:hover': {
              backgroundColor: isLight ? 'rgba(37, 99, 235, 0.04)' : 'rgba(37, 99, 235, 0.08)',
            },
            '&:disabled': {
              color: isLight ? '#94a3b8' : '#64748b',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isLight
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.3)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            borderTop: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
            boxShadow: isLight
              ? '0 -1px 3px 0 rgb(0 0 0 / 0.1)'
              : '0 -4px 6px -1px rgb(0 0 0 / 0.3)',
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: isLight ? '#64748b' : '#94a3b8',
            '&.Mui-selected': {
              color: '#2563eb',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
              opacity: 1, // Always show labels
            },
            '&:not(.Mui-selected) .MuiBottomNavigationAction-label': {
              opacity: 1, // Always show labels even when not selected
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          colorPrimary: {
            '&.MuiChip-outlined': {
              backgroundColor: 'transparent',
            },
          },
          colorSecondary: {
            '&.MuiChip-outlined': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isLight ? '#ffffff' : '#1e293b',
              '& fieldset': {
                borderColor: isLight ? '#e2e8f0' : '#475569',
              },
              '&:hover fieldset': {
                borderColor: '#2563eb',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2563eb',
              },
              '&.Mui-disabled': {
                backgroundColor: isLight ? '#f8fafc' : '#0f172a',
                '& fieldset': {
                  borderColor: isLight ? '#e2e8f0' : '#334155',
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: isLight ? '#64748b' : '#94a3b8',
              '&.Mui-focused': {
                color: '#2563eb',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: isLight ? '#0f172a' : '#f8fafc',
              '&::placeholder': {
                color: isLight ? '#94a3b8' : '#64748b',
                opacity: 1,
              },
              '&.Mui-disabled': {
                color: isLight ? '#94a3b8' : '#64748b',
                WebkitTextFillColor: isLight ? '#94a3b8' : '#64748b',
              },
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isLight ? '#0f172a' : '#f8fafc',
          },
          h1: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 700,
          },
          h2: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 700,
          },
          h3: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 600,
          },
          h4: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 600,
          },
          h5: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 600,
          },
          h6: {
            color: isLight ? '#0f172a' : '#f8fafc',
            fontWeight: 600,
          },
          body1: {
            color: isLight ? '#0f172a' : '#f8fafc',
          },
          body2: {
            color: isLight ? '#64748b' : '#94a3b8',
          },
          caption: {
            color: isLight ? '#64748b' : '#94a3b8',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              transform: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            backgroundImage: 'none',
            color: isLight ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
  });
};

// Default light theme
const modernTheme = createModernTheme('light');

export default modernTheme;
