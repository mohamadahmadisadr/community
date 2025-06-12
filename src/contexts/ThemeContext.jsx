import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createModernTheme } from '../theme/telegramTheme';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'app-theme-mode';

export const CustomThemeProvider = ({ children }) => {
  // Initialize theme mode from localStorage or default to light
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme || 'light';
    } catch (error) {
      return 'light';
    }
  });

  // Create theme based on current mode
  const theme = createModernTheme(themeMode);

  // Save theme mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      
      // Update Telegram Web App theme if available
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        try {
          if (themeMode === 'dark') {
            tg.setHeaderColor('#1e293b');
            tg.setBackgroundColor('#0f172a');
          } else {
            tg.setHeaderColor('#ffffff');
            tg.setBackgroundColor('#ffffff');
          }
        } catch (e) {
          // Silently handle error
        }
      }

      // Update CSS custom properties for Telegram
      const root = document.documentElement;
      if (themeMode === 'dark') {
        root.style.setProperty('--tg-theme-bg-color', '#0f172a');
        root.style.setProperty('--tg-theme-secondary-bg-color', '#1e293b');
        root.style.setProperty('--tg-theme-text-color', '#f8fafc');
        root.style.setProperty('--tg-theme-hint-color', '#94a3b8');
      } else {
        root.style.setProperty('--tg-theme-bg-color', '#ffffff');
        root.style.setProperty('--tg-theme-secondary-bg-color', '#f8fafc');
        root.style.setProperty('--tg-theme-text-color', '#0f172a');
        root.style.setProperty('--tg-theme-hint-color', '#64748b');
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeMode(mode);
    }
  };

  const value = {
    themeMode,
    toggleTheme,
    setTheme,
    isDark: themeMode === 'dark',
    theme, // Add theme to context value
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

export default CustomThemeProvider;
