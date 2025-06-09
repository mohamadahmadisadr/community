// Utility functions for handling contact actions

export const handlePhoneCall = (phoneNumber) => {
  if (phoneNumber) {
    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    window.open(`tel:${cleanPhone}`, "_self");
  }
};

export const handleEmailClick = (email) => {
  if (email) {
    window.open(`mailto:${email}`, "_self");
  }
};

export const handleDirections = (address, city) => {
  if (address) {
    const fullAddress = city ? `${address}, ${city}` : address;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    // Try to detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try to open native maps app
      const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
      window.open(mapsUrl, "_blank");
    } else {
      // On desktop, open Google Maps in new tab
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    }
  }
};

export const getClickableChipProps = (type, value, additionalValue = null) => {
  const baseProps = {
    sx: {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }
  };

  switch (type) {
    case 'phone':
      return {
        ...baseProps,
        onClick: () => handlePhoneCall(value),
        title: `Call ${value}`
      };
    
    case 'email':
      return {
        ...baseProps,
        onClick: () => handleEmailClick(value),
        title: `Send email to ${value}`
      };
    
    case 'address':
      return {
        ...baseProps,
        onClick: () => handleDirections(value, additionalValue),
        title: `Get directions to ${value}${additionalValue ? `, ${additionalValue}` : ''}`
      };
    
    default:
      return baseProps;
  }
};
