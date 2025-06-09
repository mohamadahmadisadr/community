# Firestore Rules for Comments Feature

Add these rules to your Firestore security rules to enable the comments feature:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing rules for other collections...
    
    // Comments collection rules
    match /comments/{commentId} {
      // Allow anyone to read approved comments
      allow read: if resource.data.status == 'approved';
      
      // Allow authenticated users to create comments
      allow create: if request.auth != null 
        && request.auth.uid == resource.data.userId
        && request.resource.data.status == 'approved'
        && request.resource.data.keys().hasAll(['itemId', 'itemType', 'text', 'userId', 'createdAt']);
      
      // Allow users to update their own comments (if needed)
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Allow admins to delete comments (optional)
      allow delete: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

## Comment Document Structure

Each comment document should have the following structure:

```javascript
{
  itemId: "string",           // ID of the item being commented on
  itemType: "string",         // Type: "restaurant", "cafe", "event", "job"
  text: "string",             // Comment text
  userId: "string",           // Telegram user ID
  userFirstName: "string",    // User's first name
  userLastName: "string",     // User's last name
  username: "string",         // Telegram username
  userPhotoUrl: "string",     // User's profile photo URL
  createdAt: timestamp,       // When comment was created
  status: "string"            // "approved", "pending", "rejected"
}
```

## Security Notes

1. **Authentication**: Comments can only be created by authenticated users
2. **User Verification**: Users can only create comments with their own user ID
3. **Auto-Approval**: Comments are auto-approved for now (can be changed to require moderation)
4. **Read Access**: Only approved comments are visible to all users
5. **Telegram Integration**: User data comes from Telegram WebApp API

## Setup Instructions

1. Go to Firebase Console > Firestore Database > Rules
2. Add the comments rules to your existing rules
3. Deploy the rules
4. The comments feature will work automatically with Telegram authentication
