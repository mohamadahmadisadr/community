// Telegram Web App initialization
export const initTelegramWebApp = () => {
  // Check if running in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // Initialize the web app
    tg.ready();

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('app-theme-mode') || 'light';

    // Set initial theme colors
    try {
      if (savedTheme === 'dark') {
        tg.setHeaderColor('#1e293b');
        tg.setBackgroundColor('#0f172a');
      } else {
        tg.setHeaderColor('#ffffff');
        tg.setBackgroundColor('#ffffff');
      }
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

// Initialize theme-aware CSS for Telegram
export const initTelegramTheme = () => {
  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('app-theme-mode') || 'light';

  // Add CSS for theme support
  const style = document.createElement('style');
  style.id = 'telegram-theme-style';

  if (savedTheme === 'dark') {
    style.textContent = `
      /* Dark theme for Telegram */
      html, body, #root {
        background-color: #0f172a !important;
        color: #f8fafc !important;
      }

      .tg-viewport {
        background-color: #0f172a !important;
      }
    `;
  } else {
    style.textContent = `
      /* Light theme for Telegram */
      html, body, #root {
        background-color: #ffffff !important;
        color: #0f172a !important;
      }

      .tg-viewport {
        background-color: #ffffff !important;
      }
    `;
  }

  // Remove existing style if present
  const existingStyle = document.getElementById('telegram-theme-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);
};

// Legacy function for backward compatibility
export const forceLightTheme = initTelegramTheme;
