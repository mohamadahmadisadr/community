import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';
import {
  Person,
  Language,
  Palette,
  Notifications,
  Security,
  Info,
  Telegram,
  LocationOn,
  Schedule,
  Phone
} from '@mui/icons-material';
import AppBarLayout from '../../layouts/AppBarLayout';
import { getTelegramUser } from '../../utils/telegramInit';

const ProfilePage = () => {
  // Initialize with fallback data immediately
  const [telegramUser, setTelegramUser] = useState({
    id: '123456789',
    firstName: 'Demo',
    lastName: 'User',
    username: 'demouser',
    languageCode: 'en',
    isPremium: false,
    photoUrl: null,
    allowsWriteToPm: true
  });
  const [loading, setLoading] = useState(false); // Start with false since we have fallback data
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en'
  });

  useEffect(() => {
    console.log('ProfilePage: Component mounted, checking for Telegram data...');

    // Try to get real Telegram user data
    const updateTelegramData = () => {
      const telegramUserData = getTelegramUser();

      if (telegramUserData) {
        console.log('Setting Telegram user data:', telegramUserData);
        setTelegramUser(telegramUserData);
        return true;
      } else {
        console.log('No Telegram data available, keeping fallback data');
        return false;
      }
    };

    // Try immediately
    updateTelegramData();

    // Try again after delays in case Telegram loads later
    const timer1 = setTimeout(updateTelegramData, 500);
    const timer2 = setTimeout(updateTelegramData, 2000);
    const timer3 = setTimeout(updateTelegramData, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'fa': 'فارسی',
      'ar': 'العربية',
      'fr': 'Français',
      'de': 'Deutsch',
      'es': 'Español',
      'ru': 'Русский'
    };
    return languages[code] || code?.toUpperCase() || 'Unknown';
  };

  return (
    <AppBarLayout
      title="Profile"
      icon={<Person />}
      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      iconColor="#667eea"
    >
      {/* User Profile Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '2px solid #667eea20',
          mb: 3,
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={telegramUser?.photoUrl}
              sx={{
                width: 80,
                height: 80,
                mr: 3,
                bgcolor: '#667eea',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {!telegramUser?.photoUrl && getInitials(telegramUser?.firstName, telegramUser?.lastName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                {telegramUser?.firstName || 'Unknown'} {telegramUser?.lastName || ''}
              </Typography>
              {telegramUser?.username && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  @{telegramUser.username}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Telegram />}
                  label={`ID: ${telegramUser?.id || 'Unknown'}`}
                  size="small"
                  sx={{
                    bgcolor: '#0088cc',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
                {telegramUser?.isPremium && (
                  <Chip
                    label="Premium"
                    size="small"
                    sx={{
                      bgcolor: '#ffd700',
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                <Chip
                  icon={<Language />}
                  label={getLanguageName(telegramUser?.languageCode)}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    '& .MuiChip-icon': {
                      color: '#667eea'
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '2px solid #4ecdc420',
          mb: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
            Account Information
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Person sx={{ color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText
                primary="Full Name"
                secondary={`${telegramUser?.firstName || 'Unknown'} ${telegramUser?.lastName || ''}`.trim()}
              />
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Telegram sx={{ color: '#0088cc' }} />
              </ListItemIcon>
              <ListItemText
                primary="Username"
                secondary={telegramUser?.username ? `@${telegramUser.username}` : 'Not set'}
              />
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Language sx={{ color: '#4ecdc4' }} />
              </ListItemIcon>
              <ListItemText
                primary="Language"
                secondary={getLanguageName(telegramUser?.languageCode)}
              />
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Phone sx={{ color: '#96ceb4' }} />
              </ListItemIcon>
              <ListItemText
                primary="Messages"
                secondary={telegramUser?.allowsWriteToPm ? 'Allows private messages' : 'Private messages disabled'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '2px solid #ff6b6b20',
          mb: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
            App Settings
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Notifications sx={{ color: '#ff6b6b' }} />
              </ListItemIcon>
              <ListItemText
                primary="Notifications"
                secondary="Receive updates about new jobs and events"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleSettingChange('notifications')}
                    color="primary"
                  />
                }
                label=""
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Palette sx={{ color: '#96ceb4' }} />
              </ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Switch between light and dark theme"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleSettingChange('darkMode')}
                    color="primary"
                  />
                }
                label=""
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '2px solid #ffeaa720',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>
            About App
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Info sx={{ color: '#ffeaa7' }} />
              </ListItemIcon>
              <ListItemText
                primary="Iranian Community Canada"
                secondary="Connect with the Iranian community across Canada"
              />
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Schedule sx={{ color: '#dda0dd' }} />
              </ListItemIcon>
              <ListItemText
                primary="Version"
                secondary="1.0.0 - Telegram Mini App"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </AppBarLayout>
  );
};

export default ProfilePage;
