// Utility functions for Telegram WebApp integration

export const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp && 
         window.Telegram.WebApp.initData;
};

export const getTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const getTelegramUser = () => {
  const webApp = getTelegramWebApp();
  if (webApp && webApp.initDataUnsafe?.user) {
    const user = webApp.initDataUnsafe.user;
    return {
      id: user.id,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      username: user.username || '',
      photoUrl: user.photo_url || '',
      languageCode: user.language_code || 'en'
    };
  }
  return null;
};

export const initTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    // Expand the web app to full height
    webApp.expand();
    
    // Enable closing confirmation
    webApp.enableClosingConfirmation();
    
    // Set header color
    webApp.setHeaderColor('#667eea');
    
    // Ready the web app
    webApp.ready();
    
    return true;
  }
  return false;
};

export const showTelegramAlert = (message) => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.showAlert(message);
  } else {
    alert(message);
  }
};

export const showTelegramConfirm = (message, callback) => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.showConfirm(message, callback);
  } else {
    const result = confirm(message);
    callback(result);
  }
};

// Production version - no test user functionality
