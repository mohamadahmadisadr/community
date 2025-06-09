# 🔗 Community App Integration Guide

This guide provides specific instructions for integrating the existing Iranian Community app with the admin panel. These changes are required for the admin panel to function properly.

## 🎯 **Critical Changes Required in Community App**

### **1. User Collection Updates**

#### **Add Required Fields to User Registration:**
```javascript
// When creating a new user account
const userData = {
  // Existing fields...
  email: user.email,
  displayName: user.displayName,
  
  // NEW REQUIRED FIELDS FOR ADMIN PANEL:
  role: "user", // Default role for new users
  status: "pending", // Requires admin approval
  approved: false, // Must be approved by admin
  approvedBy: null,
  approvedAt: null,
  lastLogin: serverTimestamp(),
  loginCount: 1,
  isOnline: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
```

#### **Update Login Process:**
```javascript
// On user login, update activity tracking
await updateDoc(doc(db, 'users', user.uid), {
  lastLogin: serverTimestamp(),
  loginCount: increment(1),
  isOnline: true,
  updatedAt: serverTimestamp(),
});

// On logout
await updateDoc(doc(db, 'users', user.uid), {
  isOnline: false,
  updatedAt: serverTimestamp(),
});
```

### **2. Content Creation Updates**

#### **Jobs Submission Form Changes:**
```javascript
// Add these fields to job creation
const jobData = {
  // Existing job fields...
  title: formData.title,
  description: formData.description,
  company: formData.company,
  
  // NEW REQUIRED FIELDS:
  category: formData.category, // Required dropdown
  status: "pending", // Default status
  moderatedBy: null,
  moderatedAt: null,
  moderationNotes: "",
  createdBy: user.uid,
  createdByName: user.displayName,
  createdByEmail: user.email,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  views: 0,
  applications: 0,
};
```

#### **Events Submission Form Changes:**
```javascript
// Add these fields to event creation
const eventData = {
  // Existing event fields...
  title: formData.title,
  description: formData.description,
  eventDate: formData.eventDate,
  
  // NEW REQUIRED FIELDS:
  category: formData.category, // Required dropdown
  status: "pending", // Default status
  moderatedBy: null,
  moderatedAt: null,
  moderationNotes: "",
  createdBy: user.uid,
  createdByName: user.displayName,
  createdByEmail: user.email,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  views: 0,
  registrations: 0,
};
```

#### **Restaurant Submission Form Changes:**
```javascript
// Add these fields to restaurant creation
const restaurantData = {
  // Existing restaurant fields...
  name: formData.name,
  description: formData.description,
  address: formData.address,
  
  // NEW REQUIRED FIELDS:
  category: formData.category, // Required dropdown
  status: "pending", // Default status
  moderatedBy: null,
  moderatedAt: null,
  moderationNotes: "",
  createdBy: user.uid,
  createdByName: user.displayName,
  createdByEmail: user.email,
  ownerId: user.uid, // Restaurant owner
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  views: 0,
  rating: 0,
  reviewCount: 0,
};
```

#### **Cafe Submission Form Changes:**
```javascript
// Add these fields to cafe creation
const cafeData = {
  // Existing cafe fields...
  name: formData.name,
  description: formData.description,
  address: formData.address,
  
  // NEW REQUIRED FIELDS:
  category: formData.category, // Required dropdown
  status: "pending", // Default status
  moderatedBy: null,
  moderatedAt: null,
  moderationNotes: "",
  createdBy: user.uid,
  createdByName: user.displayName,
  createdByEmail: user.email,
  ownerId: user.uid, // Cafe owner
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  views: 0,
  rating: 0,
  reviewCount: 0,
};
```

### **3. Content Display Updates**

#### **Filter Content by Status:**
```javascript
// Only show approved content to regular users
const getApprovedJobs = async () => {
  const q = query(
    collection(db, 'jobs'),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Similar for events, restaurants, cafes
const getApprovedEvents = async () => {
  const q = query(
    collection(db, 'events'),
    where('status', '==', 'approved'),
    where('eventDate', '>=', new Date()), // Future events only
    orderBy('eventDate', 'asc')
  );
  // ... rest of implementation
};
```

#### **Track Views for Analytics:**
```javascript
// When user views content, increment view count
const trackView = async (collection, docId) => {
  await updateDoc(doc(db, collection, docId), {
    views: increment(1),
    updatedAt: serverTimestamp(),
  });
};

// Usage examples:
// trackView('jobs', jobId);
// trackView('events', eventId);
// trackView('restaurants', restaurantId);
// trackView('cafes', cafeId);
```

### **4. Category Dropdown Components**

#### **Job Categories Component:**
```javascript
const JobCategorySelect = ({ value, onChange, required = true }) => {
  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'retail', label: 'Retail' },
    { value: 'construction', label: 'Construction' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'government', label: 'Government' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <select value={value} onChange={onChange} required={required}>
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat.value} value={cat.value}>{cat.label}</option>
      ))}
    </select>
  );
};
```

#### **Event Categories Component:**
```javascript
const EventCategorySelect = ({ value, onChange, required = true }) => {
  const categories = [
    { value: 'cultural', label: 'Cultural' },
    { value: 'educational', label: 'Educational' },
    { value: 'business', label: 'Business' },
    { value: 'social', label: 'Social' },
    { value: 'religious', label: 'Religious' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts' },
    { value: 'music', label: 'Music' },
    { value: 'food', label: 'Food' },
    { value: 'charity', label: 'Charity' },
    { value: 'networking', label: 'Networking' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <select value={value} onChange={onChange} required={required}>
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat.value} value={cat.value}>{cat.label}</option>
      ))}
    </select>
  );
};
```

### **5. User Approval System**

#### **Check User Approval Status:**
```javascript
// Add this check to protected routes/actions
const checkUserApproval = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return false;
  
  const userData = userDoc.data();
  return userData.approved === true && userData.status === 'active';
};

// Usage in components
const ProtectedAction = ({ children }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkUserApproval(user.uid).then(approved => {
        setIsApproved(approved);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  
  if (!isApproved) {
    return (
      <div>
        <h3>Account Pending Approval</h3>
        <p>Your account is pending admin approval. You'll be notified once approved.</p>
      </div>
    );
  }

  return children;
};
```

### **6. Notification System Integration**

#### **Listen for User Notifications:**
```javascript
// Add to user dashboard/header
const useUserNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [userId]);

  return { notifications, unreadCount };
};
```

### **7. Form Validation Updates**

#### **Add Category Validation:**
```javascript
// Update form validation schemas
const jobValidationSchema = {
  title: { required: true, minLength: 5 },
  description: { required: true, minLength: 20 },
  company: { required: true },
  category: { required: true }, // NEW REQUIRED FIELD
  location: { required: true },
  // ... other validations
};

const eventValidationSchema = {
  title: { required: true, minLength: 5 },
  description: { required: true, minLength: 20 },
  category: { required: true }, // NEW REQUIRED FIELD
  eventDate: { required: true },
  location: { required: true },
  // ... other validations
};
```

## 🚨 **Critical Implementation Steps**

### **Step 1: Database Migration**
1. **Backup existing data** before making changes
2. **Add new fields** to existing documents with default values
3. **Update security rules** to include new fields
4. **Test with sample data** before full deployment

### **Step 2: Form Updates**
1. **Add category dropdowns** to all content creation forms
2. **Update form validation** to require categories
3. **Add status tracking** to submission process
4. **Test form submissions** with new fields

### **Step 3: Display Logic Updates**
1. **Filter content by status** in all listing pages
2. **Add view tracking** to content detail pages
3. **Update search/filter** to include categories
4. **Test content visibility** for different user roles

### **Step 4: User System Updates**
1. **Add approval workflow** to registration
2. **Update login process** with activity tracking
3. **Add role-based access** to protected features
4. **Test user approval flow** end-to-end

## ⚠️ **Important Notes**

1. **Backward Compatibility**: Existing content without status/category fields should default to "approved" and "other" respectively
2. **User Experience**: Show clear messages when content is pending approval
3. **Performance**: Use proper indexing for status and category queries
4. **Security**: Ensure only approved users can create content
5. **Testing**: Test all flows thoroughly before production deployment

## 🔄 **Migration Script Example**

```javascript
// Run this once to update existing documents
const migrateExistingData = async () => {
  // Update existing jobs
  const jobsSnapshot = await getDocs(collection(db, 'jobs'));
  const jobUpdates = jobsSnapshot.docs.map(doc => 
    updateDoc(doc.ref, {
      status: 'approved', // Assume existing content is approved
      category: 'other', // Default category
      views: 0,
      applications: 0,
      updatedAt: serverTimestamp(),
    })
  );
  
  // Similar for events, restaurants, cafes
  await Promise.all(jobUpdates);
  console.log('Migration completed');
};
```

This integration guide ensures your community app will work seamlessly with the admin panel! 🚀
