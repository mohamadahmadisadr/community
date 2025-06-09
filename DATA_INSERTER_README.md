# Iranian Community Canada - Data Inserter

A Node.js script to insert restaurant and café data into Firebase Firestore with proper classification and structure.

## 🚀 Quick Start

### 1. Setup
```bash
# Copy the package.json content
cp data-inserter-package.json package.json

# Install dependencies
npm install firebase

# Or if you prefer yarn
yarn add firebase
```

### 2. Configure Firebase
Edit `insertData.js` and replace the Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Run the Script
```bash
# Run the data insertion
node insertData.js

# Or using npm script
npm run insert
```

## 📊 What This Script Does

### **Data Classification & Enhancement:**

#### **🏪 Restaurants (13 items):**
- **Rumi** - Montreal, QC (Middle Eastern, Persian)
- **Diba Restaurant** - Montreal, QC (Persian, Iranian)
- **Maison Inja** - Montreal, QC (Persian, Café style)
- **Cheminee Perse** - Montreal, QC (Persian, Halal)
- **Chelow BBQ** - Montreal, QC (BBQ, Persian)
- **Ispahan Restaurant** - Montreal, QC (Persian, Vegetarian options)
- **Azalea Buvette** - Montreal, QC (Persian, Mediterranean)
- **La Maison De Kebab** - Montreal, QC (Persian, Halal)
- **Fardin Express** - Montreal, QC (Persian, Grill)
- **Gillaneh** - Vancouver, BC (Persian)
- **Tehran Restaurant** - Montreal, QC (Persian)
- **House Of Kabob** - Calgary, AB (Iranian)
- **Queen of Persia** - Toronto, ON (Persian)

#### **☕ Cafés (2 items):**
- **Byblos Le Petit Café** - Montreal, QC (Persian, Breakfast)
- **Café Toranj** - Montreal, QC (Persian Café)

### **🔧 Data Processing Features:**

#### **1. Address Parsing:**
```javascript
// Extracts city, province, postal code
"820 Avenue Atwater, Montreal, QC H4C 2H1" 
→ {
  address: "820 Avenue Atwater",
  city: "Montreal", 
  province: "Quebec",
  postalCode: "H4C 2H1",
  country: "Canada"
}
```

#### **2. Cuisine Classification:**
```javascript
// Automatically detects cuisine type
"Persian, Iranian, Middle Eastern, Halal, Kebab"
→ cuisine: "Persian"
```

#### **3. Feature Extraction:**
```javascript
// Restaurants
"Vegetarian, Gluten-free Options, Patio seating"
→ features: ["vegetarian", "gluten-free", "outdoor-seating", "dine-in"]

// Cafés  
"Café, Persian, Patio seating"
→ features: {
  hasWifi: false,
  hasOutdoorSeating: true,
  hasParking: false,
  petFriendly: false
}
```

### **📋 Generated Database Structure:**

#### **Restaurants Collection:**
```javascript
{
  name: "Restaurant Name",
  description: "Full description...",
  cuisine: "Persian",
  category: "Restaurant",
  location: {
    address: "123 Main St",
    city: "Montreal",
    province: "Quebec", 
    country: "Canada",
    postalCode: "H1H 1H1",
    coordinates: { lat: null, lng: null }
  },
  contact: {
    phone: "",
    email: "",
    website: ""
  },
  hours: {
    monday: "", tuesday: "", wednesday: "",
    thursday: "", friday: "", saturday: "", sunday: ""
  },
  priceRange: "$$",
  rating: 0,
  reviewCount: 0,
  features: ["dine-in", "takeout", "halal"],
  paymentMethods: ["cash", "card", "interac"],
  image: "",
  images: [],
  menu: "",
  status: "pending",
  verified: false,
  featured: false,
  views: 0,
  postedBy: "system-import",
  approvedBy: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

#### **Cafés Collection:**
```javascript
{
  name: "Café Name",
  description: "Full description...",
  specialty: "Persian Tea",
  category: "Cafe",
  location: { /* same as restaurants */ },
  contact: { /* same as restaurants */ },
  hours: { /* same as restaurants */ },
  priceRange: "$$",
  rating: 0,
  reviewCount: 0,
  features: {
    hasWifi: true,
    hasOutdoorSeating: false,
    hasParking: false,
    petFriendly: false,
    hasDelivery: false,
    hasTakeout: true
  },
  amenities: ["free-wifi", "outdoor-seating"],
  paymentMethods: ["cash", "card", "interac"],
  image: "",
  images: [],
  menu: "",
  status: "pending",
  verified: false,
  featured: false,
  views: 0,
  postedBy: "system-import",
  approvedBy: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## 🎯 After Running the Script

### **1. All items will have status: "pending"**
- Items won't be visible in the app until approved
- Admin panel is required to approve items

### **2. Admin Panel Actions Needed:**
- ✅ **Review** each item for accuracy
- ✅ **Add missing info** (phone, website, hours)
- ✅ **Upload images** for better presentation  
- ✅ **Set status** to "active" to make visible
- ✅ **Verify** business information

### **3. Geographic Distribution:**
- **Montreal, QC**: 11 establishments
- **Vancouver, BC**: 1 establishment  
- **Calgary, AB**: 1 establishment
- **Toronto, ON**: 1 establishment

## 🔧 Customization

### **Add More Data:**
Edit the `rawData` array in `insertData.js`:

```javascript
const rawData = [
  // Add your new restaurants/cafés here
  {
    "name": "New Restaurant",
    "description": "Persian, Iranian, Grill",
    "address": "123 New St, City, Province",
    "category": "Restaurant" // or "Cafe"
  }
];
```

### **Modify Classification Logic:**
Edit the `DataInserter.js` class methods:
- `parseCuisine()` - Cuisine detection
- `parseFeatures()` - Feature extraction
- `parseAddress()` - Address parsing

## 📊 Expected Output

```
🔥 Firebase Data Inserter for Iranian Community Canada
============================================================
🚀 Starting to insert 15 items...
✅ Restaurant "Rumi" inserted with ID: abc123
✅ Restaurant "Diba Restaurant" inserted with ID: def456
✅ Cafe "Byblos Le Petit Café" inserted with ID: ghi789
...

📊 INSERTION SUMMARY:
✅ Successfully inserted: 15 items
   - Restaurants: 13
   - Cafés: 2
❌ Failed insertions: 0 items

🎉 Data insertion completed!
```

## 🚨 Important Notes

1. **Firebase Config**: Replace with your actual Firebase configuration
2. **Admin Approval**: All items start as "pending" status
3. **Missing Data**: Phone, website, hours need to be added via admin panel
4. **Images**: Upload images through admin panel after insertion
5. **Verification**: Verify business information before making items active

Ready to populate your Iranian Community Canada database! 🇮🇷🇨🇦
