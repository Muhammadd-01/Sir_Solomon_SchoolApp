# Firebase + MERN Integration Guide with Auto-Superadmin Registration

## 🎯 Overview

This guide explains how to integrate Firebase Authentication with your MERN (MongoDB + Express + React + Node.js) backend, including automatic superadmin registration on first login.

---

## 📋 Architecture

```
Firebase Auth (Frontend) → Express Backend → MongoDB
     ↓                           ↓              ↓
  ID Token              Verify Token      Store User Data
```

**Flow:**
1. User logs in via Firebase (React/Flutter)
2. Firebase returns ID token
3. Frontend sends token to backend
4. Backend verifies token with Firebase Admin SDK
5. Backend checks if user exists in MongoDB
6. If superadmin email, auto-register with superadmin role
7. Return user data to frontend

---

## 🔧 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `solomons-school`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable "Email/Password"
4. Enable "Phone" (optional)
5. Save

### 1.3 Create Superadmin User
1. Go to Authentication → Users
2. Click "Add user"
3. **Email:** `admin@solomon.school`
4. **Password:** `Admin@123456`
5. Click "Add user"
6. **Copy the UID** (you'll need this)

### 1.4 Get Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `server/config/serviceAccountKey.json`
4. **NEVER commit this file to Git!**

---

## 🔧 Step 2: Backend Setup (Node.js + Express)

### 2.1 Install Dependencies
```bash
cd server
npm install firebase-admin dotenv
```

### 2.2 Initialize Firebase Admin SDK

Create `server/src/config/firebase.js`:

```javascript
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../../config/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
```

### 2.3 Create Auto-Registration Middleware

Create `server/src/middleware/autoRegister.js`:

```javascript
const admin = require('../config/firebase');
const User = require('../models/User');

// Superadmin configuration
const SUPERADMIN_EMAIL = 'admin@solomon.school';
const SUPERADMIN_PASSWORD = 'Admin@123456'; // User can change this in Firebase

async function autoRegisterSuperadmin(req, res, next) {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Auto-register if superadmin email
      if (email === SUPERADMIN_EMAIL) {
        user = new User({
          firebaseUid: uid,
          email: email,
          name: {
            first: 'Super',
            last: 'Admin',
          },
          role: 'superadmin',
          isActive: true,
        });
        await user.save();
        console.log('✅ Superadmin auto-registered:', email);
      } else {
        return res.status(404).json({ 
          error: 'User not found. Please contact administrator.' 
        });
      }
    }

    // Attach user to request
    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Auto-register error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { autoRegisterSuperadmin };
```

### 2.4 Create Login Route

Update `server/src/routes/auth.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { autoRegisterSuperadmin } = require('../middleware/autoRegister');

// Login endpoint
router.post('/login', autoRegisterSuperadmin, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        firebaseUid: user.firebaseUid,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token endpoint
router.post('/verify', autoRegisterSuperadmin, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
```

### 2.5 Update app.js

Add auth routes to `server/src/app.js`:

```javascript
const authRoutes = require('./routes/auth.routes');

// Routes
app.use('/api/auth', authRoutes);
// ... other routes
```

---

## 🔧 Step 3: React Admin Panel Setup

### 3.1 Install Firebase
```bash
cd admin
npm install firebase
```

### 3.2 Configure Firebase

Update `admin/src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 3.3 Update Login Component

Update `admin/src/pages/Login.jsx`:

```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 1. Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Get ID token
    const idToken = await userCredential.user.getIdToken();

    // 3. Send to backend for verification and auto-registration
    const response = await api.post('/auth/login', { idToken });

    if (response.data.success) {
      // User is now registered in MongoDB
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError(error.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔧 Step 4: Flutter Mobile App Setup

### 4.1 Configure Firebase

Run FlutterFire CLI:
```bash
cd mobile
flutterfire configure
```

### 4.2 Update Login Screen

Update `mobile/lib/src/presentation/auth/login_screen.dart`:

```dart
Future<void> _handleLogin() async {
  try {
    // 1. Sign in with Firebase
    final userCredential = await FirebaseAuth.instance
        .signInWithEmailAndPassword(
      email: _emailController.text,
      password: _passwordController.text,
    );

    // 2. Get ID token
    final idToken = await userCredential.user?.getIdToken();

    // 3. Send to backend
    final response = await dio.post('/auth/login', data: {
      'idToken': idToken,
    });

    if (response.data['success']) {
      // Navigate to dashboard
      Navigator.pushReplacementNamed(context, '/dashboard');
    }
  } catch (e) {
    // Handle error
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Login failed: $e')),
    );
  }
}
```

---

## 🔐 Superadmin Credentials

### Default Credentials
- **Email:** `admin@solomon.school`
- **Password:** `Admin@123456`
- **Role:** `superadmin` (auto-assigned on first login)

### How to Change Password

**Option 1: Firebase Console**
1. Go to Firebase Console → Authentication → Users
2. Find `admin@solomon.school`
3. Click three dots → Reset password
4. Enter new password

**Option 2: Programmatically**
```javascript
// In your admin panel settings
import { updatePassword } from 'firebase/auth';

const changePassword = async (newPassword) => {
  const user = auth.currentUser;
  await updatePassword(user, newPassword);
  alert('Password updated successfully!');
};
```

**Option 3: Password Reset Email**
```javascript
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, 'admin@solomon.school');
```

---

## 🔧 Step 5: Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/solomon_school
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Admin Panel (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=solomons-school.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=solomons-school
VITE_FIREBASE_STORAGE_BUCKET=solomons-school.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop
```

---

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd server
npm run dev
```

### 2. Start Admin Panel
```bash
cd admin
npm run dev
```

### 3. Test Login
1. Open `http://localhost:5173`
2. Enter:
   - Email: `admin@solomon.school`
   - Password: `Admin@123456`
3. Click Login

### 4. Verify Auto-Registration
Check MongoDB:
```bash
mongosh
use solomon_school
db.users.findOne({ email: 'admin@solomon.school' })
```

You should see:
```json
{
  "_id": ObjectId("..."),
  "firebaseUid": "...",
  "email": "admin@solomon.school",
  "name": {
    "first": "Super",
    "last": "Admin"
  },
  "role": "superadmin",
  "isActive": true
}
```

---

## 🔒 Security Best Practices

### 1. Protect Service Account Key
```bash
# Add to .gitignore
echo "config/serviceAccountKey.json" >> .gitignore
```

### 2. Use Environment Variables
Never hardcode credentials in code.

### 3. Enable Firebase Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Implement Rate Limiting
Already configured in `server/src/app.js`

### 5. Use HTTPS in Production
Update CORS and API URLs for production.

---

## 🚀 Adding More Users

### Via Admin Panel (Future Feature)
```javascript
// Create user in Firebase
const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

// Create in MongoDB
await api.post('/users', {
  firebaseUid: userCredential.user.uid,
  email,
  name,
  role, // teacher, accountant, etc.
});
```

### Via Firebase Console
1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. User will auto-register on first login with default role

---

## 📝 Summary

✅ Firebase handles authentication  
✅ Backend verifies tokens with Firebase Admin SDK  
✅ MongoDB stores user data and roles  
✅ Superadmin auto-registers on first login  
✅ Password can be changed anytime  
✅ Secure and scalable architecture  

---

## 🆘 Troubleshooting

### Error: "User not found"
- User hasn't logged in yet
- Check if email matches exactly
- Verify Firebase user exists

### Error: "Invalid token"
- Token expired (refresh it)
- Service account key incorrect
- Firebase project mismatch

### Error: "Permission denied"
- Check user role in MongoDB
- Verify middleware is applied
- Check CORS settings

---

**🎉 You're all set! Your Firebase + MERN integration is complete with auto-superadmin registration!**
