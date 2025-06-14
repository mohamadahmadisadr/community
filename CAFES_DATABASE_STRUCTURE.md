# Cafes Database Structure - Iranian Community Admin Panel

## Overview
This document defines the complete database structure for cafes in the Iranian Community Admin Panel. The structure is designed for Firebase Firestore but can be adapted to other NoSQL or SQL databases.

## Collection: `cafes`

### Document Structure

```javascript
{
  // Document ID (auto-generated by Firestore)
  id: "string", // Auto-generated document ID
  
  // Basic Cafe Information
  name: "string", // Required - Cafe name
  description: "string", // Required - Cafe description
  specialty: "string", // Required - Primary specialty (coffee, tea, etc.)
  category: "string", // Required - Cafe category (see categories below)
  
  // Location Information
  location: {
    address: "string", // Required - Street address
    city: "string", // Required - City name
    province: "string", // Required - Province/State
    postalCode: "string", // Optional - Postal/ZIP code
    coordinates: { // Optional - GPS coordinates
      lat: "number",
      lng: "number"
    }
  },
  
  // Contact Information
  contactInfo: {
    phone: "string", // Optional - Phone number (not required)
    email: "string", // Optional - Email address
    website: "string" // Optional - Website URL
  },
  
  // Business Hours
  hours: {
    monday: "string", // Format: "HH:MM-HH:MM" or "Closed"
    tuesday: "string",
    wednesday: "string",
    thursday: "string",
    friday: "string",
    saturday: "string",
    sunday: "string"
  },
  
  // Pricing and Features
  priceRange: "string", // Required - Price range (see price ranges below)
  rating: "number", // Average rating (0-5)
  features: ["string"], // Array of cafe features
  
  // Status and Settings
  status: "string", // Required - Cafe status (see statuses below)
  featured: "boolean", // Whether cafe is featured (default: false)
  
  // Metadata
  userId: "string", // ID of user who created the cafe
  createdAt: "timestamp", // Firestore server timestamp
  updatedAt: "timestamp" // Firestore server timestamp
}
```

## Field Specifications

### Required Fields
- `name` (string, min 3 characters)
- `description` (string, min 10 characters)
- `specialty` (string, must be from predefined specialties)
- `category` (string, must be from predefined categories)
- `location.address` (string)
- `location.city` (string, must be from predefined cities)
- `location.province` (string, must be from predefined provinces)
- `priceRange` (string, must be from predefined ranges)
- `status` (string, must be from predefined statuses)

### Optional Fields
- `location.postalCode` (string)
- `location.coordinates` (object with lat/lng)
- `contactInfo.phone` (string) - **Note: Phone is NOT required for cafes**
- `contactInfo.email` (string, valid email format)
- `contactInfo.website` (string, valid URL format)
- `hours` (object with daily hours)
- `rating` (number, 0-5)
- `features` (array of strings)
- `featured` (boolean, default: false)

### Validation Rules
- `rating` must be between 0 and 5
- `contactInfo.email` must be valid email format if provided
- `contactInfo.website` must be valid URL if provided
- Hours format: "HH:MM-HH:MM" (24-hour) or "Closed"

## Predefined Values

### Cafe Categories
```javascript
const CAFE_CATEGORIES = [
  "Persian Tea House",
  "Coffee Shop",
  "Traditional Cafe",
  "Modern Cafe",
  "Specialty Coffee",
  "Tea House",
  "Hookah Lounge",
  "Dessert Cafe",
  "Bakery Cafe",
  "Internet Cafe",
  "Study Cafe",
  "Other"
];
```

### Cafe Specialties
```javascript
const CAFE_SPECIALTIES = [
  "Persian Tea",
  "Turkish Coffee",
  "Specialty Coffee",
  "Espresso",
  "Traditional Tea",
  "Herbal Tea",
  "Hookah",
  "Persian Sweets",
  "Pastries",
  "Ice Cream",
  "Smoothies",
  "Light Meals",
  "Breakfast",
  "Other"
];
```

### Price Ranges
```javascript
const PRICE_RANGES = [
  "$",      // Budget-friendly (Under $10 per person)
  "$$",     // Moderate ($10-20 per person)
  "$$$",    // Expensive ($20-35 per person)
  "$$$$"    // Very Expensive ($35+ per person)
];
```

### Cafe Statuses
```javascript
const CAFE_STATUSES = [
  "draft",      // Cafe is being created/edited
  "pending",    // Waiting for admin approval
  "approved",   // Approved and visible to public
  "rejected",   // Rejected by admin
  "closed",     // Cafe is temporarily closed
  "permanently_closed" // Cafe is permanently closed
];
```

### Cafe Features
```javascript
const CAFE_FEATURES = [
  "Dine-in",
  "Takeout",
  "Delivery",
  "Drive-through",
  "Outdoor Seating",
  "WiFi",
  "Study Area",
  "Quiet Environment",
  "Live Music",
  "Board Games",
  "Hookah Available",
  "Persian Tea Service",
  "Traditional Setting",
  "Modern Atmosphere",
  "Parking Available",
  "Wheelchair Accessible",
  "Family Friendly",
  "Pet Friendly",
  "Halal Options",
  "Vegetarian Options",
  "Vegan Options",
  "Late Night Hours",
  "Early Morning Hours",
  "Group Seating",
  "Private Rooms",
  "Credit Cards Accepted",
  "Cash Only",
  "Student Discounts"
];
```

### Cities (Canadian Focus)
```javascript
const CITIES = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "Sherbrooke",
  "St. Johns",
  "Barrie"
];
```

### Provinces (Canada)
```javascript
const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
];
```

## Data Types and Formats

### Timestamps
- **Storage**: Firestore Timestamp objects
- **API**: ISO 8601 strings (YYYY-MM-DDTHH:mm:ss.sssZ)

### Numbers
- **rating**: Float between 0.0 and 5.0 (e.g., 4.5)
- **coordinates.lat/lng**: Float (e.g., 43.6532, -79.3832)

### Arrays
- **features**: Array of strings from predefined features list

### Strings
- **hours**: Format "HH:MM-HH:MM" (e.g., "07:00-22:00") or "Closed"
- **contactInfo.email**: Valid email format
- **contactInfo.website**: Valid URL format
- **contactInfo.phone**: Flexible phone format

## Example Documents

### Traditional Persian Tea House Example
```javascript
{
  id: "cafe_123",
  name: "Golestan Persian Tea House",
  description: "Traditional Persian tea house serving authentic Persian tea, sweets, and light meals in a cozy, cultural atmosphere. Perfect for relaxing conversations and enjoying Persian hospitality.",
  specialty: "Persian Tea",
  category: "Persian Tea House",
  location: {
    address: "789 Bloor Street West",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M6G 1L5",
    coordinates: {
      lat: 43.6629,
      lng: -79.4010
    }
  },
  contactInfo: {
    phone: "+1-416-555-0789",
    email: "info@golestanteahouse.ca",
    website: "https://golestanteahouse.ca"
  },
  hours: {
    monday: "10:00-22:00",
    tuesday: "10:00-22:00",
    wednesday: "10:00-22:00",
    thursday: "10:00-23:00",
    friday: "10:00-24:00",
    saturday: "09:00-24:00",
    sunday: "09:00-22:00"
  },
  priceRange: "$$",
  rating: 4.6,
  features: [
    "Dine-in",
    "Takeout",
    "Persian Tea Service",
    "Traditional Setting",
    "Hookah Available",
    "WiFi",
    "Group Seating",
    "Halal Options",
    "Parking Available",
    "Credit Cards Accepted"
  ],
  status: "approved",
  featured: true,
  userId: "user_456",
  createdAt: "2024-03-15T10:30:00.000Z",
  updatedAt: "2024-03-20T14:15:00.000Z"
}
```

### Modern Coffee Shop Example
```javascript
{
  id: "cafe_789",
  name: "Aria Coffee Roasters",
  description: "Modern specialty coffee shop featuring locally roasted beans, artisanal pastries, and a comfortable workspace environment. Great for meetings and studying.",
  specialty: "Specialty Coffee",
  category: "Coffee Shop",
  location: {
    address: "456 Queen Street East",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5A 1T4",
    coordinates: {
      lat: 43.6591,
      lng: -79.3656
    }
  },
  contactInfo: {
    phone: "", // Phone not provided
    email: "hello@ariacoffee.ca",
    website: ""
  },
  hours: {
    monday: "07:00-19:00",
    tuesday: "07:00-19:00",
    wednesday: "07:00-19:00",
    thursday: "07:00-19:00",
    friday: "07:00-20:00",
    saturday: "08:00-20:00",
    sunday: "08:00-18:00"
  },
  priceRange: "$",
  rating: 4.3,
  features: [
    "Dine-in",
    "Takeout",
    "WiFi",
    "Study Area",
    "Modern Atmosphere",
    "Early Morning Hours",
    "Vegetarian Options",
    "Vegan Options",
    "Student Discounts",
    "Credit Cards Accepted"
  ],
  status: "approved",
  featured: false,
  userId: "user_789",
  createdAt: "2024-03-10T09:00:00.000Z",
  updatedAt: "2024-03-10T09:00:00.000Z"
}
```

## Validation Rules Summary

1. **Name**: Required, minimum 3 characters
2. **Description**: Required, minimum 10 characters
3. **Specialty**: Required, must be from predefined list
4. **Category**: Required, must be from predefined list
5. **Location**: Address, city, and province required from predefined lists
6. **Price Range**: Required, must be from predefined ranges ($, $$, $$$, $$$$)
7. **Contact Info**: All fields optional, but email must be valid format if provided
8. **Rating**: Must be between 0 and 5 if provided
9. **Hours**: Must follow "HH:MM-HH:MM" format or "Closed"
10. **Status**: Must be from predefined list

## Indexes Recommended

For optimal query performance, create these Firestore indexes:

```javascript
// Composite indexes
cafes: [
  ["status", "createdAt"],
  ["category", "status", "createdAt"],
  ["specialty", "status", "createdAt"],
  ["location.city", "status", "createdAt"],
  ["location.province", "status", "createdAt"],
  ["priceRange", "status", "createdAt"],
  ["featured", "status", "createdAt"],
  ["rating", "status", "createdAt"],
  ["userId", "createdAt"]
]

// Single field indexes (auto-created)
- status
- category
- specialty
- location.city
- location.province
- priceRange
- featured
- rating
- userId
- createdAt
```

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cafes/{cafeId} {
      // Allow read for approved cafes
      allow read: if resource.data.status == 'approved';

      // Allow admin users to read all cafes
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Allow users to create cafes (will be pending)
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.status == 'pending';

      // Allow users to update their own cafes (if not approved yet)
      allow update: if request.auth != null &&
                       resource.data.userId == request.auth.uid &&
                       resource.data.status in ['draft', 'pending'];

      // Allow admin to update any cafe
      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Allow admin to delete cafes
      allow delete: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Form Validation Schema (Yup)

```javascript
const cafeValidationSchema = yup.object({
  name: yup.string()
    .required('Cafe name is required')
    .min(3, 'Name must be at least 3 characters'),

  description: yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),

  specialty: yup.string()
    .required('Specialty is required')
    .oneOf(CAFE_SPECIALTIES, 'Invalid specialty'),

  category: yup.string()
    .required('Category is required')
    .oneOf(CAFE_CATEGORIES, 'Invalid category'),

  location: yup.object({
    address: yup.string()
      .required('Address is required'),

    city: yup.string()
      .required('City is required')
      .oneOf(CITIES, 'Invalid city'),

    province: yup.string()
      .required('Province is required')
      .oneOf(PROVINCES, 'Invalid province'),

    postalCode: yup.string()
      .nullable()
  }),

  contactInfo: yup.object({
    phone: yup.string()
      .nullable(), // Phone is NOT required for cafes

    email: yup.string()
      .email('Invalid email format')
      .nullable(),

    website: yup.string()
      .url('Invalid URL format')
      .nullable()
  }),

  hours: yup.object({
    monday: yup.string().nullable(),
    tuesday: yup.string().nullable(),
    wednesday: yup.string().nullable(),
    thursday: yup.string().nullable(),
    friday: yup.string().nullable(),
    saturday: yup.string().nullable(),
    sunday: yup.string().nullable()
  }),

  priceRange: yup.string()
    .required('Price range is required')
    .oneOf(PRICE_RANGES, 'Invalid price range'),

  rating: yup.number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot exceed 5')
    .nullable(),

  features: yup.array()
    .of(yup.string().oneOf(CAFE_FEATURES, 'Invalid feature'))
    .default([]),

  status: yup.string()
    .required('Status is required')
    .oneOf(CAFE_STATUSES, 'Invalid status'),

  featured: yup.boolean()
    .default(false)
});
```

## Search and Filtering

### Search Fields
Cafes can be searched by:
- `name` (full-text search)
- `description` (full-text search)
- `specialty` (exact match)
- `features` (array contains)

### Filter Options
- **Category**: Filter by cafe category
- **Specialty**: Filter by specialty type
- **Location**: Filter by city and/or province
- **Price Range**: Filter by price range ($, $$, $$$, $$$$)
- **Features**: Filter by specific features (WiFi, study area, etc.)
- **Rating**: Filter by minimum rating
- **Featured**: Show only featured cafes
- **Status**: Filter by status (admin only)

### Sort Options
- **Rating**: Highest to lowest (default)
- **Name**: Alphabetical
- **Date**: Most recent first
- **Price**: Lowest to highest
- **Distance**: Nearest first (if location provided)

## Analytics and Metrics

### Cafe Metrics to Track
```javascript
{
  totalCafes: number,
  activeCafes: number,
  closedCafes: number,
  cafesByCategory: { [category]: number },
  cafesBySpecialty: { [specialty]: number },
  cafesByLocation: { [city]: number },
  cafesByPriceRange: { [range]: number },
  averageRating: number,
  cafesCreatedThisMonth: number,
  featuredCafes: number
}
```

## Key Differences from Restaurants

1. **Specialty Field**: Cafes have a `specialty` field instead of `cuisine`
2. **Categories**: Different categories focused on cafe types (tea house, coffee shop, etc.)
3. **Features**: Cafe-specific features (study area, hookah, Persian tea service)
4. **Price Ranges**: Generally lower price ranges than restaurants
5. **Hours**: Often different operating hours (early morning, late night)
6. **Atmosphere**: Focus on ambiance and environment features

## API Endpoints Structure

```javascript
// GET /api/cafes - Get all approved cafes with filtering
{
  query: {
    category?: string,
    specialty?: string,
    city?: string,
    province?: string,
    priceRange?: string,
    featured?: boolean,
    rating?: number,
    page?: number,
    limit?: number,
    search?: string
  }
}

// POST /api/cafes - Create new cafe
{
  body: CafeDocument // (status will be set to 'pending')
}

// PUT /api/cafes/:id - Update cafe
{
  params: { id: string },
  body: Partial<CafeDocument>
}

// DELETE /api/cafes/:id - Delete cafe (admin only)
{
  params: { id: string }
}

// GET /api/cafes/:id - Get specific cafe
{
  params: { id: string }
}
```

---

**Note**: This structure is designed for the Iranian Community Admin Panel's cafe directory and can be adapted for other community cafe platforms. The structure supports comprehensive cafe management with admin approval workflows, flexible contact information (phone not required), and detailed filtering capabilities specific to cafe environments and Persian tea house culture.
