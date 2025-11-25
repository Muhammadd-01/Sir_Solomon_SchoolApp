# Developer Manual

Complete guide for setting up and running Solomon's Secondary School Management System locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Backend Setup](#backend-setup)
5. [Mobile App Setup](#mobile-app-setup)
6. [Admin Panel Setup](#admin-panel-setup)
7. [Running the System](#running-the-system)
8. [Database Seeding](#database-seeding)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 18+ and npm
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **Flutter SDK** 3.x+
  - Download: https://flutter.dev/docs/get-started/install
  - Verify: `flutter --version`
  - Run: `flutter doctor` to check for issues

- **MongoDB**
  - Option 1: MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas
  - Option 2: Local MongoDB - https://www.mongodb.com/try/download/community
  - Verify: `mongosh --version` (if local)

- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Development Tools (Recommended)

- **VS Code** with extensions:
  - Flutter
  - Dart
  - ESLint
  - Prettier
  - MongoDB for VS Code

- **Android Studio** (for Android development)
  - Download: https://developer.android.com/studio
  - Install Android SDK and emulator

- **Xcode** (for iOS development, macOS only)
  - Download from Mac App Store
  - Install iOS Simulator

### Accounts Required

- **Firebase Account** (Google account)
- **MongoDB Atlas Account** (if using cloud)

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Sir_Solomon_SchoolApp
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Admin Panel
```bash
cd admin
npm install
```

#### Mobile App
```bash
cd mobile
flutter pub get
```

---

## Firebase Configuration

Follow the complete guide in [firebase-setup.md](firebase-setup.md).

**Quick checklist:**
- ✅ Create Firebase project
- ✅ Register Android, iOS, and Web apps
- ✅ Enable Authentication (Email, Phone, Google)
- ✅ Set up Cloud Firestore (optional)
- ✅ Set up Firebase Storage
- ✅ Configure Cloud Messaging
- ✅ Generate service account key
- ✅ Download configuration files

**Files you need:**
- `server/serviceAccountKey.json` (from Firebase Console)
- `mobile/android/app/google-services.json` (from Firebase Console)
- `mobile/ios/Runner/GoogleService-Info.plist` (from Firebase Console)
- Firebase web config (for admin panel)

---

## Backend Setup

### 1. Environment Configuration

Create `.env` file in `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your actual values:

```env
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/solomon_school

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# CORS (add your admin panel URL)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# FCM
FCM_SENDER_ID=your-sender-id

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 2. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist your IP (or allow from anywhere: `0.0.0.0/0`)
5. Get connection string and update `MONGO_URI` in `.env`

#### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Update `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/solomon_school
   ```

### 3. Place Service Account Key

1. Download `serviceAccountKey.json` from Firebase Console
2. Place it in `server/` directory
3. Verify path in `.env` matches: `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json`

### 4. Test Backend

```bash
cd server
npm run dev
```

Expected output:
```
✅ Firebase Admin SDK initialized successfully
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
╔═══════════════════════════════════════════════════════════╗
║  Solomon's Secondary School Management System - Server   ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on port 4000                           ║
║  🌍 Environment: development                              ║
║  📡 Socket.IO enabled                                     ║
╚═══════════════════════════════════════════════════════════╝
```

Test health endpoint:
```bash
curl http://localhost:4000/health
```

---

## Mobile App Setup

### 1. Configure Firebase

1. Place `google-services.json` in `mobile/android/app/`
2. Place `GoogleService-Info.plist` in `mobile/ios/Runner/`
3. Update `mobile/lib/src/core/config/firebase_config.dart` with your Firebase config

### 2. Update API Base URL

Edit `mobile/lib/src/core/constants/app_constants.dart`:

```dart
static const String baseUrl = 'http://10.0.2.2:4000/api'; // Android emulator
// OR
static const String baseUrl = 'http://localhost:4000/api'; // iOS simulator
// OR
static const String baseUrl = 'http://YOUR_LOCAL_IP:4000/api'; // Physical device
```

To find your local IP:
- Windows: `ipconfig`
- macOS/Linux: `ifconfig` or `ip addr`

### 3. Install Dependencies

```bash
cd mobile
flutter pub get
```

### 4. Run Code Generation (if needed)

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 5. Run the App

#### Android Emulator
```bash
flutter run
```

#### iOS Simulator (macOS only)
```bash
flutter run -d "iPhone 15 Pro"
```

#### Physical Device
1. Enable USB debugging (Android) or trust computer (iOS)
2. Connect device
3. Run: `flutter devices` to see connected devices
4. Run: `flutter run -d <device-id>`

---

## Admin Panel Setup

### 1. Environment Configuration

Create `.env` file in `admin/` directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2. Install Tailwind CSS (if not already installed)

```bash
cd admin
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Run Development Server

```bash
cd admin
npm run dev
```

Admin panel will be available at: http://localhost:5173

---

## Running the System

### Full Stack Development

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Admin Panel:**
```bash
cd admin
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd mobile
flutter run
```

### Using Docker Compose (Alternative)

```bash
docker-compose up
```

This will start:
- MongoDB (port 27017)
- Backend server (port 4000)
- Admin panel (port 3000)

---

## Database Seeding

### Option 1: Using Seed Script

```bash
cd server
node seed/import.js
```

This will create:
- 50+ sample students
- 10+ sample teachers
- Sample classes and timetables
- Sample attendance records

### Option 2: Manual Creation via Admin Panel

1. Open admin panel: http://localhost:5173
2. Login with Firebase account
3. Navigate to Students → Add Student
4. Fill in details and save

### Option 3: Using Postman

1. Import `seed/postman-collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:4000`
   - `firebase_token`: (get from mobile app or Firebase)
3. Run collection

---

## Testing

### Backend Tests

```bash
cd server
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

### Mobile Tests

```bash
cd mobile
flutter test                           # Unit tests
flutter test integration_test/         # Integration tests
```

### Admin Panel Tests

```bash
cd admin
npm run test:e2e        # End-to-end tests
```

---

## Troubleshooting

### Backend Issues

#### "MongoDB connection error"
- **Check**: MongoDB is running
- **Check**: `MONGO_URI` in `.env` is correct
- **Check**: Network connectivity (if using Atlas)
- **Check**: IP whitelist (if using Atlas)

#### "Firebase Admin SDK initialization failed"
- **Check**: `serviceAccountKey.json` exists in `server/`
- **Check**: `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env` is correct
- **Check**: File is valid JSON

#### "CORS error"
- **Check**: `CORS_ORIGIN` in `.env` includes your admin panel URL
- **Check**: No trailing slashes in URLs

### Mobile App Issues

#### "google-services.json not found"
- **Check**: File is in `mobile/android/app/`
- **Check**: File name is exactly `google-services.json`
- **Run**: `flutter clean` then `flutter pub get`

#### "Unable to connect to server"
- **Check**: Backend is running on port 4000
- **Check**: `baseUrl` in `app_constants.dart` is correct
- **For emulator**: Use `10.0.2.2` instead of `localhost`
- **For physical device**: Use your computer's local IP

#### "Firebase initialization error"
- **Check**: `firebase_config.dart` has correct values
- **Check**: `google-services.json` and `GoogleService-Info.plist` are in place
- **Run**: `flutter clean` and rebuild

### Admin Panel Issues

#### "Cannot connect to API"
- **Check**: Backend is running
- **Check**: `.env` has correct `VITE_API_BASE_URL`
- **Restart**: Vite dev server after changing `.env`

#### "Firebase authentication error"
- **Check**: Firebase web config in `.env` is correct
- **Check**: Firebase Authentication is enabled in console

---

## Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/school` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to service account JSON | `./serviceAccountKey.json` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | `http://localhost:3000` |

### Admin Panel (`admin/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | WebSocket URL | `http://localhost:4000` |
| `VITE_FIREBASE_*` | Firebase web config | From Firebase Console |

### Mobile App

Configured in `app_constants.dart` and `firebase_config.dart`

---

## Next Steps

- ✅ System is running locally!
- 📱 Start developing mobile features
- 🖥️ Build admin panel UI
- 🧪 Write tests
- 📚 Read API documentation in `docs/api-reference.md`
- 🚀 Deploy to production (see `docs/deployment-guide.md`)

---

## Getting Help

- **Documentation**: Check `docs/` directory
- **Firebase Issues**: See `firebase-setup.md`
- **API Reference**: See `docs/api-reference.md`
- **Database Schema**: See `docs/database-schema.md`

For additional support, contact the development team.
