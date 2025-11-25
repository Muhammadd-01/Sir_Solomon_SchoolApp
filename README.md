# Solomon's Secondary School Management System

## 🎓 Project Overview

A comprehensive school management system built with Flutter (mobile), Node.js/Express (backend), and React (admin panel). Designed for Solomon's Secondary School to manage students, teachers, attendance, assignments, fees, and more.

## ✨ Key Features

### Mobile App (Flutter)
- 📱 **Multi-role support**: Student, Parent, Teacher
- 🔐 **Firebase Authentication**: Email, Phone OTP, Google Sign-In
- 📊 **Student Dashboard**: Attendance stats, assignments, announcements
- 👨‍🏫 **Teacher Features**: QR attendance scanner, assignment management
- 📅 **Real-time Timetable**: Live updates via Socket.IO
- 💰 **Fee Management**: View invoices and payment status
- 🌙 **Dark Mode**: Full theme support
- 🌐 **Localization**: English + Urdu
- 📴 **Offline Support**: Local caching with Hive

### Backend (Node.js + Express + MongoDB)
- 🔒 **Secure API**: Firebase token verification, role-based access
- 📡 **Real-time Updates**: Socket.IO for live attendance
- 🗄️ **MongoDB Database**: Scalable data storage
- 🚀 **RESTful API**: Complete CRUD operations
- 📊 **Reporting**: Attendance, grades, fee reports
- 🔔 **Push Notifications**: Firebase Cloud Messaging
- ⚡ **Rate Limiting**: Protection against abuse

### Admin Panel (React + Tailwind)
- 🎨 **Modern UI**: Tailwind CSS with custom theme
- 📈 **Dashboard**: School statistics and analytics
- 👥 **User Management**: Students, teachers, staff
- 📅 **Timetable Builder**: Visual schedule editor
- 💵 **Fee Management**: Invoicing and payment tracking
- 📢 **Announcements**: Broadcast to specific audiences
- 📊 **Reports**: Export to CSV/PDF

## 🏗️ Architecture

```
Sir_Solomon_SchoolApp/
├── mobile/          # Flutter app (Android + iOS)
├── server/          # Node.js backend
├── admin/           # React admin panel
├── infra/           # Docker & CI/CD configs
├── docs/            # Documentation
└── seed/            # Sample data
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Flutter 3.16+
- MongoDB
- Firebase project

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Mobile App Setup
```bash
cd mobile
flutter pub get
flutter run
```

### Admin Panel Setup
```bash
cd admin
npm install
cp .env.example .env
# Edit .env with your Firebase config
npm run dev
```

## 📚 Documentation

- [Developer Manual](developer-manual.md) - Complete setup guide
- [Firebase Setup](firebase-setup.md) - Step-by-step Firebase configuration
- [API Reference](docs/api-reference.md) - All API endpoints
- [Deployment Guide](docs/deployment-guide.md) - Production deployment
- [Theme Guide](docs/theme.md) - Design system

## 🎨 Design System

**Colors** (extracted from school logo):
- Primary Lime: `#B4FF71`
- Purple Accent: `#C84AB6`
- Dark Navy: `#081F5C`

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Mobile Tests
```bash
cd mobile
flutter test
```

## 🐳 Docker Deployment

```bash
docker-compose up
```

This starts MongoDB, backend server, and admin panel.

## 📦 Database Seeding

```bash
cd server
node seed/import.js
```

Creates sample students, teachers, and users.

## 🔐 Security

- ✅ Firebase authentication
- ✅ Role-based access control
- ✅ Rate limiting (100 req/min)
- ✅ Helmet.js security headers
- ✅ Environment variable protection
- ✅ HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software for Solomon's Secondary School.

## 👥 Team

Developed for Solomon's Secondary School Management.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Flutter, Node.js, React, and Firebase**
