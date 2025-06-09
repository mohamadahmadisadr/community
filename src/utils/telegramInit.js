// Telegram Web App initialization
export const initTelegramWebApp = () => {
  console.log('Initializing Telegram WebApp...');
  console.log('window.Telegram:', window.Telegram);

  // Check if running in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    console.log('Telegram WebApp object:', tg);
    console.log('Telegram WebApp initData:', tg.initData);
    console.log('Telegram WebApp initDataUnsafe:', tg.initDataUnsafe);
    console.log('Telegram WebApp user:', tg.initDataUnsafe?.user);

    // Initialize the web app
    tg.ready();

    // Set theme to light mode
    try {
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#ffffff');
    } catch (e) {
      console.log('Could not set header/background colors:', e);
    }

    // Expand the web app to full height
    try {
      tg.expand();
    } catch (e) {
      console.log('Could not expand app:', e);
    }

    // Enable closing confirmation
    try {
      tg.enableClosingConfirmation();
    } catch (e) {
      console.log('Could not enable closing confirmation:', e);
    }

    console.log('Telegram Web App initialized successfully');
    console.log('Platform:', tg.platform);
    console.log('Version:', tg.version);
    console.log('Is expanded:', tg.isExpanded);

    return tg;
  } else {
    console.log('Not running in Telegram Web App - window.Telegram not available');
    return null;
  }
};

// Get Telegram user data
export const getTelegramUser = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;

    if (user) {
      console.log('Telegram user data found:', user);
      return {
        id: user.id?.toString() || null,
        firstName: user.first_name || null,
        lastName: user.last_name || null,
        username: user.username || null,
        languageCode: user.language_code || 'en',
        isPremium: user.is_premium || false,
        photoUrl: user.photo_url || null,
        allowsWriteToPm: user.allows_write_to_pm !== false
      };
    }
  }

  console.log('No Telegram user data available');
  return null;
};

// Force light theme CSS - only fix background, preserve colors
export const forceLightTheme = () => {
  // Add CSS to only fix background issues
  const style = document.createElement('style');
  style.textContent = `
    /* Only fix main backgrounds, preserve all colors */
    html, body, #root {
      background-color: #ffffff !important;
    }

    /* Only fix bottom navigation background */
    .MuiBottomNavigation-root {
      background-color: #ffffff !important;
    }

    /* Preserve all other colors and gradients */
  `;
  document.head.appendChild(style);
};
