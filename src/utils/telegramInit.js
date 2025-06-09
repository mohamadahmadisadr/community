// Telegram Web App initialization
export const initTelegramWebApp = () => {

  // Check if running in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // Initialize the web app
    tg.ready();

    // Set theme to light mode
    try {
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#ffffff');
    } catch (e) {
      // Silently handle error
    }

    // Expand the web app to full height
    try {
      tg.expand();
    } catch (e) {
      // Silently handle error
    }

    // Enable closing confirmation
    try {
      tg.enableClosingConfirmation();
    } catch (e) {
      // Silently handle error
    }

    return tg;
  } else {
    return null;
  }
};

// Get Telegram user data
export const getTelegramUser = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;

    if (user) {
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
