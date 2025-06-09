# 🗄️ Database Structure for Iranian Community App Integration

This document provides the complete Firestore database structure needed to integrate the existing community app with the admin panel. The admin panel expects specific fields for content moderation, user management, and analytics.

## 📋 **Required Collections and Fields**

### **1. Users Collection** (`users`)
```javascript
// Document ID: Firebase Auth UID
{
  // Basic Information
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  
  // Profile Information
  profileImage: "https://storage.googleapis.com/...",
  bio: "User biography",
  location: "Toronto, ON",
  dateOfBirth: Timestamp,
  
  // Role and Status (REQUIRED FOR ADMIN PANEL)
  role: "user", // "super_admin", "admin", "moderator", "content_manager", "user"
  status: "active", // "active", "inactive", "suspended", "pending"
  
  // Admin Approval (REQUIRED)
  approved: true, // boolean - whether user is approved by admin
  approvedBy: "admin-uid", // UID of admin who approved
  approvedAt: Timestamp,
  
  // Activity Tracking (REQUIRED FOR ANALYTICS)
  lastLogin: Timestamp,
  loginCount: 0,
  isOnline: false,
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Optional Fields
  preferences: {
    language: "en",
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  
  // Social Links
  socialLinks: {
    instagram: "username",
    telegram: "username",
    linkedin: "profile-url"
  }
}
```

### **2. Jobs Collection** (`jobs`)
```javascript
// Document ID: Auto-generated
{
  // Basic Information
  title: "Software Developer",
  description: "Job description here...",
  company: "Tech Company Inc.",
  location: "Toronto, ON",
  
  // Job Details
  type: "full-time", // "full-time", "part-time", "contract", "internship"
  category: "technology", // REQUIRED FOR ADMIN PANEL
  salary: {
    min: 60000,
    max: 80000,
    currency: "CAD",
    period: "yearly" // "yearly", "monthly", "hourly"
  },
  
  // Requirements
  requirements: [
    "Bachelor's degree in Computer Science",
    "3+ years experience with React"
  ],
  skills: ["React", "JavaScript", "Node.js"],
  
  // Contact Information
  contactEmail: "hr@company.com",
  contactPhone: "+1234567890",
  applicationUrl: "https://company.com/apply",
  
  // Status and Moderation (REQUIRED FOR ADMIN PANEL)
  status: "pending", // "pending", "approved", "rejected", "expired"
  moderatedBy: "admin-uid", // UID of admin who moderated
  moderatedAt: Timestamp,
  moderationNotes: "Reason for approval/rejection",
  
  // User Information (REQUIRED)
  createdBy: "user-uid", // UID of user who created the job
  createdByName: "User Name",
  createdByEmail: "user@example.com",
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  expiresAt: Timestamp,
  
  // Analytics (REQUIRED FOR ADMIN PANEL)
  views: 0,
  applications: 0,
  
  // Optional Fields
  featured: false,
  urgent: false,
  remote: true,
  benefits: ["Health insurance", "Dental coverage"]
}
```

### **3. Events Collection** (`events`)
```javascript
// Document ID: Auto-generated
{
  // Basic Information
  title: "Persian New Year Celebration",
  description: "Event description here...",
  
  // Event Details
  category: "cultural", // REQUIRED FOR ADMIN PANEL
  type: "public", // "public", "private", "members-only"
  
  // Date and Time
  eventDate: Timestamp, // REQUIRED
  startTime: "19:00",
  endTime: "23:00",
  timezone: "America/Toronto",
  
  // Location
  location: {
    name: "Community Center",
    address: "123 Main St, Toronto, ON",
    coordinates: {
      lat: 43.6532,
      lng: -79.3832
    }
  },
  
  // Capacity and Registration
  capacity: 100,
  registrationRequired: true,
  registrationDeadline: Timestamp,
  price: 25.00,
  currency: "CAD",
  
  // Contact Information
  organizerName: "Event Organizer",
  organizerEmail: "organizer@example.com",
  organizerPhone: "+1234567890",
  
  // Status and Moderation (REQUIRED FOR ADMIN PANEL)
  status: "pending", // "pending", "approved", "rejected", "cancelled"
  moderatedBy: "admin-uid",
  moderatedAt: Timestamp,
  moderationNotes: "Reason for approval/rejection",
  
  // User Information (REQUIRED)
  createdBy: "user-uid",
  createdByName: "User Name",
  createdByEmail: "user@example.com",
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Analytics (REQUIRED FOR ADMIN PANEL)
  views: 0,
  registrations: 0,
  
  // Optional Fields
  images: ["https://storage.googleapis.com/..."],
  featured: false,
  tags: ["persian", "culture", "celebration"]
}
```

### **4. Restaurants Collection** (`restaurants`)
```javascript
// Document ID: Auto-generated
{
  // Basic Information
  name: "Persian Palace Restaurant",
  description: "Authentic Persian cuisine...",
  
  // Category and Type (REQUIRED FOR ADMIN PANEL)
  category: "persian", // "persian", "middle-eastern", "mediterranean", "international"
  cuisineType: ["Persian", "Middle Eastern"],
  
  // Location Information
  address: "456 Yonge St, Toronto, ON",
  coordinates: {
    lat: 43.6532,
    lng: -79.3832
  },
  neighborhood: "Downtown",
  
  // Contact Information
  phone: "+1234567890",
  email: "info@persianpalace.com",
  website: "https://persianpalace.com",
  
  // Business Hours
  hours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    // ... other days
  },
  
  // Pricing and Features
  priceRange: "$$", // "$", "$$", "$$$", "$$$$"
  features: ["takeout", "delivery", "dine-in", "halal"],
  paymentMethods: ["cash", "credit", "debit"],
  
  // Status and Moderation (REQUIRED FOR ADMIN PANEL)
  status: "pending", // "pending", "approved", "rejected", "closed"
  moderatedBy: "admin-uid",
  moderatedAt: Timestamp,
  moderationNotes: "Reason for approval/rejection",
  
  // User Information (REQUIRED)
  createdBy: "user-uid",
  createdByName: "User Name",
  createdByEmail: "user@example.com",
  ownerId: "owner-uid", // Restaurant owner's UID
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Analytics and Reviews (REQUIRED FOR ADMIN PANEL)
  views: 0,
  rating: 4.5,
  reviewCount: 23,
  
  // Optional Fields
  images: ["https://storage.googleapis.com/..."],
  menu: "https://storage.googleapis.com/menu.pdf",
  featured: false,
  verified: false
}
```

### **5. Cafes Collection** (`cafes`)
```javascript
// Document ID: Auto-generated
{
  // Basic Information
  name: "Persian Coffee House",
  description: "Traditional Persian tea and coffee...",
  
  // Category (REQUIRED FOR ADMIN PANEL)
  category: "persian", // "persian", "traditional", "modern", "specialty"
  type: "coffee-shop", // "coffee-shop", "tea-house", "cafe-restaurant"
  
  // Location Information
  address: "789 Bloor St, Toronto, ON",
  coordinates: {
    lat: 43.6532,
    lng: -79.3832
  },
  neighborhood: "The Annex",
  
  // Contact Information
  phone: "+1234567890",
  email: "info@persiancoffee.com",
  website: "https://persiancoffee.com",
  
  // Business Hours
  hours: {
    monday: { open: "07:00", close: "20:00", closed: false },
    // ... other days
  },
  
  // Features and Amenities
  features: ["wifi", "outdoor-seating", "study-friendly", "persian-tea"],
  amenities: ["parking", "wheelchair-accessible"],
  
  // Status and Moderation (REQUIRED FOR ADMIN PANEL)
  status: "pending", // "pending", "approved", "rejected", "closed"
  moderatedBy: "admin-uid",
  moderatedAt: Timestamp,
  moderationNotes: "Reason for approval/rejection",
  
  // User Information (REQUIRED)
  createdBy: "user-uid",
  createdByName: "User Name",
  createdByEmail: "user@example.com",
  ownerId: "owner-uid",
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Analytics (REQUIRED FOR ADMIN PANEL)
  views: 0,
  rating: 4.2,
  reviewCount: 15,
  
  // Optional Fields
  images: ["https://storage.googleapis.com/..."],
  menu: "https://storage.googleapis.com/menu.pdf",
  featured: false,
  verified: false
}
```

### **6. Notifications Collection** (`notifications`)
```javascript
// Document ID: Auto-generated
{
  // Notification Content
  title: "System Maintenance Notice",
  message: "The system will be under maintenance...",
  type: "info", // "info", "success", "warning", "error"
  
  // Targeting
  recipients: "all", // "all", "role", "specific"
  selectedRole: "user", // if recipients = "role"
  selectedUsers: ["uid1", "uid2"], // if recipients = "specific"
  
  // Delivery Channels
  channels: {
    inApp: true,
    email: false,
    sms: false
  },
  
  // Scheduling
  scheduledFor: null, // Timestamp for scheduled notifications
  status: "sent", // "sent", "scheduled", "failed"
  
  // Sender Information (REQUIRED)
  sentBy: "admin-uid",
  sentByName: "Admin Name",
  recipientCount: 1247,
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### **7. User Notifications Collection** (`userNotifications`)
```javascript
// Document ID: Auto-generated
{
  // Reference to main notification
  notificationId: "notification-doc-id",
  
  // User Information (REQUIRED)
  userId: "user-uid",
  
  // Notification Content
  title: "System Maintenance Notice",
  message: "The system will be under maintenance...",
  type: "info",
  
  // Read Status (REQUIRED FOR ADMIN PANEL)
  read: false,
  readAt: null, // Timestamp when marked as read
  
  // Timestamps (REQUIRED)
  createdAt: Timestamp
}
```

### **8. Settings Collection** (`settings`)
```javascript
// Document ID: "general"
{
  // General Settings
  general: {
    siteName: "Iranian Community Canada",
    siteDescription: "Connecting Iranian community across Canada",
    contactEmail: "info@iraniancommunitycanda.ca",
    timezone: "America/Toronto",
    language: "en",
    currency: "CAD"
  },
  
  // Security Settings
  security: {
    requireEmailVerification: true,
    enableTwoFactorAuth: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableAuditLog: true
  },
  
  // Content Settings
  content: {
    autoApproveJobs: false,
    autoApproveEvents: false,
    autoApproveRestaurants: false,
    autoApproveCafes: false,
    enableComments: true,
    enableRatings: true,
    moderateComments: true
  },
  
  // Notification Settings
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserRegistration: true,
    contentSubmission: true
  },
  
  // Timestamps (REQUIRED)
  updatedAt: Timestamp,
  updatedBy: "admin-uid"
}
```

## 📊 **Categories for Content Types**

### **Job Categories**
```javascript
const jobCategories = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "engineering",
  "marketing",
  "sales",
  "hospitality",
  "retail",
  "construction",
  "transportation",
  "government",
  "non-profit",
  "other"
];
```

### **Event Categories**
```javascript
const eventCategories = [
  "cultural",
  "educational",
  "business",
  "social",
  "religious",
  "sports",
  "arts",
  "music",
  "food",
  "charity",
  "networking",
  "workshop",
  "conference",
  "other"
];
```

### **Restaurant Categories**
```javascript
const restaurantCategories = [
  "persian",
  "middle-eastern",
  "mediterranean",
  "international",
  "fast-food",
  "fine-dining",
  "casual-dining",
  "takeout",
  "halal",
  "vegetarian",
  "other"
];
```

### **Cafe Categories**
```javascript
const cafeCategories = [
  "persian",
  "traditional",
  "modern",
  "specialty",
  "tea-house",
  "coffee-shop",
  "hookah-lounge",
  "study-cafe",
  "other"
];
```

## 🔄 **Status Values for Content Moderation**

### **Content Status Options**
```javascript
const contentStatuses = [
  "pending",    // Waiting for admin review
  "approved",   // Approved by admin
  "rejected",   // Rejected by admin
  "expired",    // Expired (for jobs/events)
  "cancelled",  // Cancelled (for events)
  "closed"      // Closed (for businesses)
];
```

### **User Status Options**
```javascript
const userStatuses = [
  "active",     // Active user
  "inactive",   // Inactive user
  "suspended",  // Suspended by admin
  "pending"     // Pending admin approval
];
```

## 🔒 **Required Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - admin access for management
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin']);
    }
    
    // Content collections - users can create, admins can moderate
    match /{collection}/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        collection in ['jobs', 'events', 'restaurants', 'cafes'];
      allow update: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin', 'moderator']);
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Admin-only collections
    match /{collection}/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'] &&
        collection in ['notifications', 'settings'];
    }
    
    // User notifications - users can read their own
    match /userNotifications/{notificationId} {
      allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
  }
}
```

## 📝 **Implementation Notes for Community App**

### **Required Changes in Community App:**

1. **Add Status Fields** - All content creation forms must include status field (default: "pending")
2. **Add Category Fields** - All content forms must include category selection
3. **Add Moderation Fields** - moderatedBy, moderatedAt, moderationNotes
4. **Add User Role System** - Implement role-based access control
5. **Add Analytics Tracking** - Track views, applications, registrations
6. **Update User Registration** - Include approval workflow
7. **Add Timestamps** - Ensure all documents have createdAt/updatedAt

### **Content Submission Flow:**
1. User creates content (job/event/restaurant/cafe)
2. Content is saved with status: "pending"
3. Admin receives notification of new content
4. Admin reviews and approves/rejects through admin panel
5. User receives notification of approval/rejection
6. Approved content becomes visible to public

This database structure ensures full compatibility between your community app and the admin panel! 🚀
