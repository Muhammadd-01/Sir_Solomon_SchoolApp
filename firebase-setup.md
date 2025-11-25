# Firebase Setup Guide

This guide will walk you through setting up Firebase for Solomon's Secondary School Management System.

## Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)
- Basic understanding of Firebase services

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `solomons-school` (or your preferred name)
4. Click **Continue**
5. **Google Analytics**: You can enable or disable (recommended: enable for production)
6. Click **Create project**
7. Wait for project creation to complete
8. Click **Continue** to go to project dashboard

---

## Step 2: Register Apps

### 2.1 Register Android App

1. In Firebase Console, click the **Android icon** to add Android app
2. **Android package name**: `com.school.solomon.solomon_school_app`
   - ⚠️ This must match the package name in your Flutter project
3. **App nickname** (optional): `Solomon School Android`
4. **Debug signing certificate SHA-1** (optional for now, required for Google Sign-In)
5. Click **Register app**
6. **Download `google-services.json`**
   - Save this file to: `mobile/android/app/google-services.json`
7. Click **Next** → **Next** → **Continue to console**

### 2.2 Register iOS App

1. In Firebase Console, click the **iOS icon** to add iOS app
2. **iOS bundle ID**: `com.school.solomon.solomonSchoolApp`
   - ⚠️ This must match the bundle ID in your Flutter iOS project
3. **App nickname** (optional): `Solomon School iOS`
4. **App Store ID** (optional, leave blank for now)
5. Click **Register app**
6. **Download `GoogleService-Info.plist`**
   - Save this file to: `mobile/ios/Runner/GoogleService-Info.plist`
7. Click **Next** → **Next** → **Continue to console**

### 2.3 Register Web App (for Admin Panel)

1. In Firebase Console, click the **Web icon** (`</>`) to add web app
2. **App nickname**: `Solomon School Admin`
3. **Also set up Firebase Hosting** (optional, uncheck for now)
4. Click **Register app**
5. **Copy the Firebase configuration object**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "solomons-school.firebaseapp.com",
     projectId: "solomons-school",
     storageBucket: "solomons-school.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
6. Save this configuration - you'll need it for the admin panel
7. Click **Continue to console**

---

## Step 3: Enable Authentication

1. In Firebase Console sidebar, click **Build** → **Authentication**
2. Click **Get started**

### 3.1 Enable Email/Password Authentication

1. Click **Sign-in method** tab
2. Click **Email/Password**
3. Toggle **Enable** to ON
4. Click **Save**

### 3.2 Enable Phone Authentication

1. Click **Phone** in the sign-in providers list
2. Toggle **Enable** to ON
3. Click **Save**
4. ⚠️ **Note**: Phone authentication requires additional setup:
   - Add test phone numbers for development
   - Configure reCAPTCHA for web
   - Set up App Check for production

### 3.3 Enable Google Sign-In (Optional)

1. Click **Google** in the sign-in providers list
2. Toggle **Enable** to ON
3. **Project support email**: Enter your email
4. Click **Save**
5. For Android: You'll need to add SHA-1 certificate fingerprint (see Android setup)

---

## Step 4: Set Up Cloud Firestore (Optional)

> **Note**: This project uses MongoDB as the primary database. Firestore is optional for mobile-first caching.

1. In Firebase Console sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. **Start in production mode** (we'll add rules later)
4. **Cloud Firestore location**: Choose closest to your users (e.g., `asia-south1` for India)
5. Click **Enable**

### 4.1 Configure Security Rules

1. Click **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check user role
    function hasRole(role) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == resource.data.firebaseUid || 
         hasRole('teacher') || 
         hasRole('admin'));
      allow write: if hasRole('admin') || hasRole('teacher');
    }
    
    // Teachers collection
    match /teachers/{teacherId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('admin');
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('teacher') || hasRole('admin');
    }
    
    // Announcements collection
    match /announcements/{announcementId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('teacher') || hasRole('admin');
    }
    
    // Users collection (for role verification)
    match /users/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow write: if hasRole('admin');
    }
  }
}
```

3. Click **Publish**

---

## Step 5: Set Up Firebase Storage

1. In Firebase Console sidebar, click **Build** → **Storage**
2. Click **Get started**
3. **Start in production mode** (we'll add rules later)
4. **Cloud Storage location**: Use same as Firestore
5. Click **Done**

### 5.1 Configure Storage Rules

1. Click **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check user role
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    
    // Student profile photos
    match /students/{studentId}/profile.{ext} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (request.auth.uid == studentId || hasRole('admin') || hasRole('teacher'));
    }
    
    // Assignment submissions
    match /assignments/{assignmentId}/{studentId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (request.auth.uid == studentId || hasRole('teacher'));
    }
    
    // Announcements attachments
    match /announcements/{announcementId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if hasRole('teacher') || hasRole('admin');
    }
    
    // Event gallery
    match /events/{eventId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if hasRole('admin');
    }
  }
}
```

3. Click **Publish**

---

## Step 6: Set Up Cloud Messaging (FCM)

1. In Firebase Console sidebar, click **Build** → **Cloud Messaging**
2. No additional setup required - FCM is enabled by default
3. **Note the Sender ID** from Project Settings (you'll need this)

### 6.1 Get Server Key (for backend)

1. Click **Project Settings** (gear icon) → **Cloud Messaging** tab
2. Scroll to **Cloud Messaging API (Legacy)**
3. If disabled, click **Enable Cloud Messaging API**
4. **Server key**: This will be used by the backend (but we'll use service account instead)

---

## Step 7: Generate Service Account Key (CRITICAL)

> ⚠️ **SECURITY WARNING**: Never commit this file to version control!

1. Click **Project Settings** (gear icon) → **Service accounts** tab
2. Click **Generate new private key**
3. Click **Generate key** in the confirmation dialog
4. A JSON file will be downloaded (e.g., `solomons-school-firebase-adminsdk-xxxxx.json`)
5. **Rename** this file to `serviceAccountKey.json`
6. **Move** this file to: `server/serviceAccountKey.json`
7. ⚠️ **Verify** that `serviceAccountKey.json` is in your `.gitignore`

---

## Step 8: Configure Flutter App

### 8.1 Update Firebase Config (Mobile)

1. Open `mobile/lib/src/core/config/firebase_config.dart`
2. Replace the placeholder values with your actual Firebase configuration
3. Get the values from:
   - **Android**: `mobile/android/app/google-services.json`
   - **iOS**: `mobile/ios/Runner/GoogleService-Info.plist`
   - **Web**: From Step 2.3

Example:
```dart
static const FirebaseOptions android = FirebaseOptions(
  apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  appId: '1:123456789:android:abcdef123456',
  messagingSenderId: '123456789',
  projectId: 'solomons-school',
  storageBucket: 'solomons-school.appspot.com',
);
```

### 8.2 Android Configuration

1. Ensure `google-services.json` is in `mobile/android/app/`
2. Open `mobile/android/build.gradle` and verify:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
   }
   ```
3. Open `mobile/android/app/build.gradle` and verify at the bottom:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

### 8.3 iOS Configuration

1. Ensure `GoogleService-Info.plist` is in `mobile/ios/Runner/`
2. Open Xcode: `open mobile/ios/Runner.xcworkspace`
3. Verify `GoogleService-Info.plist` is added to the project
4. Configure capabilities:
   - Select **Runner** → **Signing & Capabilities**
   - Click **+ Capability** → Add **Push Notifications**
   - Click **+ Capability** → Add **Background Modes** → Check **Remote notifications**

---

## Step 9: Configure Backend Server

1. Open `server/.env` (create from `.env.example` if needed)
2. Set the Firebase service account path:
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```
3. The server will automatically initialize Firebase Admin SDK on startup

---

## Step 10: Configure Admin Panel

1. Open `admin/src/config/firebase.js` (create if doesn't exist)
2. Add your web Firebase configuration from Step 2.3:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "solomons-school.firebaseapp.com",
     projectId: "solomons-school",
     storageBucket: "solomons-school.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export default app;
   ```

---

## Step 11: Set Custom Claims (User Roles)

To assign roles to users (teacher, admin, etc.), you need to set custom claims via Firebase Admin SDK.

### Option 1: Using Firebase CLI

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Create a script to set claims (see `server/scripts/setUserRole.js`)

### Option 2: Using Backend API

Create an admin endpoint to set custom claims:

```javascript
// server/src/controllers/adminController.js
exports.setUserRole = async (req, res) => {
  const { uid, role } = req.body;
  await admin.auth().setCustomUserClaims(uid, { role });
  res.json({ success: true, message: 'Role set successfully' });
};
```

---

## Step 12: Test Firebase Integration

### 12.1 Test Authentication

1. Run the mobile app: `cd mobile && flutter run`
2. Try signing up with email/password
3. Check Firebase Console → Authentication → Users
4. Verify user appears in the list

### 12.2 Test Storage

1. Upload a profile photo in the app
2. Check Firebase Console → Storage
3. Verify file appears in the correct path

### 12.3 Test FCM

1. Send a test notification from Firebase Console → Cloud Messaging
2. Click **Send your first message**
3. Enter notification title and text
4. Select your app
5. Click **Send test message**
6. Enter your device FCM token (get from app logs)
7. Verify notification received on device

---

## Troubleshooting

### Issue: "Default FirebaseApp is not initialized"

**Solution**: Ensure `Firebase.initializeApp()` is called before any Firebase service is used.

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseConfig.initialize();
  runApp(MyApp());
}
```

### Issue: "google-services.json not found"

**Solution**: Ensure the file is in the correct location:
- Android: `mobile/android/app/google-services.json`
- iOS: `mobile/ios/Runner/GoogleService-Info.plist`

### Issue: "FirebaseException: PERMISSION_DENIED"

**Solution**: Check your Firestore/Storage security rules. Ensure the user is authenticated and has the correct role.

### Issue: "Service account key not found"

**Solution**: 
1. Verify `serviceAccountKey.json` exists in `server/`
2. Check `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`
3. Ensure the path is correct (relative or absolute)

---

## Security Best Practices

1. ✅ **Never commit** `serviceAccountKey.json` to version control
2. ✅ **Never commit** `google-services.json` or `GoogleService-Info.plist` (add to `.gitignore`)
3. ✅ **Use environment variables** for sensitive configuration
4. ✅ **Enable App Check** in production to prevent abuse
5. ✅ **Set strict security rules** for Firestore and Storage
6. ✅ **Rotate service account keys** periodically
7. ✅ **Use custom claims** for role-based access control
8. ✅ **Enable MFA** for admin accounts

---

## Next Steps

- ✅ Firebase is now configured!
- 📱 Continue with mobile app development
- 🖥️ Set up admin panel authentication
- 🔔 Implement push notifications
- 📊 Set up Firebase Analytics (optional)

For more information, see the [Firebase Documentation](https://firebase.google.com/docs).
