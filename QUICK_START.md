# Solomon's School Management System - Quick Start Guide

## 🚀 Prerequisites

- **Node.js** 18+ and npm
- **Flutter** 3.16+
- **MongoDB** (local or Atlas)
- **Firebase** project (for authentication)
- **Git**

---

## 📦 1. Clone the Repository

```bash
git clone https://github.com/Muhammadd-01/Sir_Solomon_SchoolApp.git
cd Sir_Solomon_SchoolApp
```

---

## 🔧 2. Backend Setup

### Install Dependencies
```bash
cd server
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/solomon_school
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Add Firebase Service Account
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `server/config/serviceAccountKey.json`

### Seed Database
```bash
node seed/import.js
```

### Start Server
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 💻 3. Admin Panel Setup

### Install Dependencies
```bash
cd admin
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Start Dev Server
```bash
npm run dev
```

Admin panel runs at: `http://localhost:5173`

**Login with:**
- Email: `admin@solomon.school`
- Password: `Admin@123456`

---

## 📱 4. Flutter Mobile App Setup

### Install Dependencies
```bash
cd mobile
flutter pub get
```

### Configure Firebase
1. Add `google-services.json` (Android) to `mobile/android/app/`
2. Add `GoogleService-Info.plist` (iOS) to `mobile/ios/Runner/`
3. Update `lib/src/core/config/firebase_config.dart` with your Firebase config

### Run App
```bash
flutter run
```

---

## 🐳 5. Docker Setup (Optional)

### Start All Services
```bash
docker-compose up
```

This starts:
- MongoDB on port 27017
- Backend on port 5000
- Admin Panel on port 80

---

## 🔐 Default Credentials

### Superadmin
- **Email:** admin@solomon.school
- **Password:** Admin@123456
- **Role:** superadmin

### Teacher
- **Email:** teacher@solomon.school
- **Password:** Teacher@123456
- **Role:** teacher

### Accountant
- **Email:** accountant@solomon.school
- **Password:** Accountant@123456
- **Role:** accountant

⚠️ **Change these in production!**

---

## 📝 Testing the System

### 1. Test Backend APIs
```bash
cd server
npm test
```

### 2. Test Admin Panel
1. Open `http://localhost:5173`
2. Login with superadmin credentials
3. Navigate through Students, Teachers, Attendance, etc.

### 3. Test Mobile App
1. Run `flutter run`
2. Login with test credentials
3. Explore dashboards, timetable, assignments

---

## 🛠️ Common Issues

### Flutter pub get fails
```bash
# Clear cache and retry
flutter clean
flutter pub get
```

### Admin panel CSS not loading
```bash
# Ensure Tailwind config files are .cjs
# postcss.config.cjs and tailwind.config.cjs
```

### MongoDB connection error
```bash
# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Firebase authentication error
- Verify Firebase config in `.env` files
- Check service account key path
- Enable Email/Password auth in Firebase Console

---

## 📚 Next Steps

1. **Read Documentation:**
   - [API Reference](docs/api-reference.md)
   - [Deployment Guide](docs/deployment-guide.md)
   - [Firebase Setup](firebase-setup.md)

2. **Customize:**
   - Update school name and logo
   - Configure academic year
   - Add more users

3. **Deploy:**
   - Follow deployment guide for production setup
   - Set up CI/CD pipelines
   - Configure domain and SSL

---

## 🆘 Need Help?

- Check `developer-manual.md` for detailed setup
- Review `FINAL_SUMMARY.md` for project overview
- See `walkthrough.md` for feature tour

---

**Happy Coding! 🎓**
