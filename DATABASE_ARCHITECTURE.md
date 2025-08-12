# 🗄️ Rush Chat - Complete Database Architecture

**MongoDB Atlas Database: `Chat`**  
**Connection:** `mongodb+srv://rushan:rushan1234@cluster0.sluz1rc.mongodb.net/Chat`

---

## 📊 **Database Collections Overview**

### **1. `users` Collection**
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-20 chars),
  password: String (hashed with bcrypt),
  isOnline: Boolean,
  lastSeen: Date,
  avatar: String, // File path: "/uploads/avatar-123456789.jpg"
  createdAt: Date,
  updatedAt: Date
}
```

**Data Storage:**
- ✅ **User accounts** (username, hashed password)
- ✅ **Online status** (isOnline, lastSeen)
- ✅ **Profile photos** (avatar file path stored)
- ✅ **Account timestamps** (registration date, updates)

### **2. `messages` Collection**
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User), 
  content: String (max 1000 chars),
  isRead: Boolean,
  conversationId: String, // Format: "userId1_userId2"
  createdAt: Date,
  updatedAt: Date
}
```

**Data Storage:**
- ✅ **All chat messages** (content, timestamps)
- ✅ **Message status** (read/unread)
- ✅ **Conversation threading** (conversationId)
- ✅ **User references** (senderId, receiverId)

---

## 🔄 **Data Flow Architecture**

### **User Registration/Login**
```
Frontend → API → MongoDB Users Collection
1. User submits form
2. Backend validates & hashes password
3. User document saved to MongoDB
4. JWT token returned to frontend
```

### **Profile Photo Upload**
```
Frontend → Multer → File System → MongoDB
1. User selects photo
2. Multer saves file to server/uploads/
3. File path saved to User.avatar in MongoDB
4. Frontend displays photo from backend URL
```

### **Chat Messages**
```
Frontend → API → MongoDB Messages Collection
1. User sends message
2. Backend creates Message document
3. Saved with senderId, receiverId, content
4. Frontend fetches and displays messages
```

### **Conversations**
```
MongoDB Messages → API → Frontend
1. Backend queries messages by user ID
2. Groups messages by conversationId
3. Returns conversation list with latest message
4. Frontend displays chat list
```

---

## 💾 **What's Stored in MongoDB Atlas**

### ✅ **Permanently Stored:**
- **User Accounts** (usernames, passwords, profiles)
- **Chat Messages** (all conversation history)
- **Message Status** (read/unread states)
- **User Status** (online/offline, last seen)
- **Profile Photo Paths** (file location references)
- **Conversation Threading** (message grouping)
- **Timestamps** (registration, message times, etc.)

### ⚠️ **Temporarily Stored (Render File System):**
- **Actual Photo Files** (deleted on service restart)
- **File uploads** (ephemeral storage limitation)

---

## 🔍 **Data Persistence Verification**

### **Users Collection:**
```javascript
// Example User Document
{
  "_id": "ObjectId('...')",
  "username": "john_doe",
  "password": "$2a$10$...", // Hashed
  "isOnline": true,
  "lastSeen": "2025-01-12T10:30:00.000Z",
  "avatar": "/uploads/avatar-1673512345-987654321.jpg",
  "createdAt": "2025-01-10T08:15:00.000Z",
  "updatedAt": "2025-01-12T10:30:00.000Z"
}
```

### **Messages Collection:**
```javascript
// Example Message Document  
{
  "_id": "ObjectId('...')",
  "senderId": "ObjectId('...')",
  "receiverId": "ObjectId('...')",
  "content": "Hello! How are you?",
  "isRead": false,
  "conversationId": "user1_user2",
  "createdAt": "2025-01-12T10:30:00.000Z",
  "updatedAt": "2025-01-12T10:30:00.000Z"
}
```

---

## 🚀 **Production Data Safety**

### ✅ **Safe & Persistent:**
- All user data survives service restarts
- Chat history is permanently stored
- User profiles persist across deployments  
- Message read status maintained
- Conversation threading preserved

### ⚠️ **Photo Files Only:**
- Profile photos (files) deleted on restart
- Photo paths still stored in database
- Photos need re-upload after restart
- Consider Cloudinary for permanent photo storage

---

## 📈 **Database Indexes**

```javascript
// Optimized queries with indexes:
messages.index({ conversationId: 1, createdAt: -1 })
messages.index({ senderId: 1, receiverId: 1 })
users.index({ username: 1 }, { unique: true })
```

---

## 🔐 **Data Security**

- ✅ **Passwords:** Hashed with bcrypt (salt rounds: 10)
- ✅ **Authentication:** JWT tokens for session management  
- ✅ **Data Validation:** Schema-level validation
- ✅ **Access Control:** User-specific data queries
- ✅ **Connection Security:** SSL/TLS encrypted MongoDB connection

---

**Summary:** Your entire chat application data is properly stored in MongoDB Atlas and will persist permanently! Only the uploaded photo files are temporarily stored on Render's file system. 🎉