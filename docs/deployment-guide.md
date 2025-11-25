# Deployment Guide

This guide covers deploying Solomon's Secondary School Management System to production.

## Table of Contents

1. [Server Deployment](#server-deployment)
2. [Admin Panel Deployment](#admin-panel-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [SSL/HTTPS Setup](#sslhttps-setup)

---

## Server Deployment

### Option 1: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean → Apps → Create App
   - Connect your GitHub repository
   - Select `server/` as the source directory

2. **Configure Build:**
   ```yaml
   name: solomon-server
   services:
   - name: api
     source_dir: server
     build_command: npm install
     run_command: npm start
     environment_slug: node-js
     http_port: 4000
   ```

3. **Add Environment Variables:**
   - `NODE_ENV=production`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json`
   - `JWT_SECRET=<generate-strong-secret>`
   - `CORS_ORIGIN=https://your-admin-panel.com`

4. **Upload Service Account:**
   - Use DigitalOcean's file upload or encrypted secrets
   - Never commit `serviceAccountKey.json` to Git

5. **Deploy:**
   - Click "Create Resources"
   - App will auto-deploy on every push to main branch

### Option 2: AWS EC2

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or larger
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 4000 (API)

2. **SSH into Instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies:**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   sudo npm install -g pm2
   ```

4. **Clone Repository:**
   ```bash
   git clone <your-repo-url>
   cd Sir_Solomon_SchoolApp/server
   npm install
   ```

5. **Set Environment Variables:**
   ```bash
   cp .env.example .env
   nano .env
   # Fill in production values
   ```

6. **Start with PM2:**
   ```bash
   pm2 start src/server.js --name solomon-api
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name api.yourschool.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourschool.com
   ```

---

## Admin Panel Deployment

### Option 1: Netlify

1. **Connect Repository:**
   - Go to Netlify → New site from Git
   - Select your repository
   - Set base directory: `admin`

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `admin/dist`

3. **Environment Variables:**
   - Add all `VITE_*` variables from `.env.example`
   - Set production Firebase config
   - Set `VITE_API_BASE_URL=https://api.yourschool.com`

4. **Deploy:**
   - Click "Deploy site"
   - Auto-deploys on every push to main

5. **Custom Domain:**
   - Go to Domain settings
   - Add custom domain: `admin.yourschool.com`
   - Configure DNS (A record or CNAME)

### Option 2: Vercel

1. **Import Project:**
   - Go to Vercel → New Project
   - Import from GitHub
   - Root directory: `admin`

2. **Configure:**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables:**
   - Add all `VITE_*` variables

4. **Deploy:**
   - Click "Deploy"
   - Auto-deploys on push

---

## Mobile App Deployment

### Android (Google Play Store)

1. **Generate Keystore:**
   ```bash
   keytool -genkey -v -keystore solomon-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias solomon
   ```

2. **Configure Signing:**
   Create `mobile/android/key.properties`:
   ```properties
   storePassword=<your-password>
   keyPassword=<your-password>
   keyAlias=solomon
   storeFile=../solomon-release-key.jks
   ```

3. **Update `build.gradle`:**
   ```gradle
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile file(keystoreProperties['storeFile'])
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }
   ```

4. **Build APK:**
   ```bash
   cd mobile
   flutter build apk --release
   ```

5. **Build App Bundle:**
   ```bash
   flutter build appbundle --release
   ```

6. **Upload to Play Console:**
   - Go to Google Play Console
   - Create new app
   - Upload `build/app/outputs/bundle/release/app-release.aab`
   - Fill in store listing, screenshots, etc.
   - Submit for review

### iOS (App Store)

1. **Configure Xcode:**
   ```bash
   cd mobile
   open ios/Runner.xcworkspace
   ```

2. **Set Bundle ID:**
   - Select Runner → General
   - Set Bundle Identifier: `com.school.solomon.solomonSchoolApp`

3. **Configure Signing:**
   - Select Signing & Capabilities
   - Enable "Automatically manage signing"
   - Select your Team

4. **Build Archive:**
   ```bash
   flutter build ios --release
   ```

5. **Upload to App Store Connect:**
   - In Xcode: Product → Archive
   - Distribute App → App Store Connect
   - Upload

6. **Submit for Review:**
   - Go to App Store Connect
   - Fill in app information
   - Add screenshots
   - Submit for review

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Go to MongoDB Atlas
   - Create free M0 cluster
   - Choose region closest to your server

2. **Create Database User:**
   - Database Access → Add New Database User
   - Username: `solomon_admin`
   - Password: Generate strong password
   - Role: Read and write to any database

3. **Whitelist IP:**
   - Network Access → Add IP Address
   - For production: Add your server's IP
   - For development: Allow access from anywhere (0.0.0.0/0)

4. **Get Connection String:**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database password
   - Set as `MONGO_URI` in environment variables

---

## Environment Variables

### Server (.env)
```env
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/solomon_school
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://admin.yourschool.com,https://yourschool.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Admin Panel (.env)
```env
VITE_API_BASE_URL=https://api.yourschool.com/api
VITE_SOCKET_URL=https://api.yourschool.com
VITE_FIREBASE_API_KEY=<from-firebase-console>
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate:**
   ```bash
   sudo certbot --nginx -d api.yourschool.com
   ```

3. **Auto-Renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

Certificates auto-renew via cron job.

---

## Post-Deployment Checklist

- [ ] Server is running and accessible
- [ ] Admin panel loads and can login
- [ ] Mobile app connects to production API
- [ ] Database is backed up regularly
- [ ] SSL certificates are valid
- [ ] Firebase is configured for production
- [ ] Environment variables are secure
- [ ] Monitoring is set up (e.g., UptimeRobot)
- [ ] Error logging is configured (e.g., Sentry)
- [ ] CI/CD pipeline is working

---

## Monitoring & Maintenance

### Server Monitoring
```bash
# Check server status
pm2 status

# View logs
pm2 logs solomon-api

# Restart server
pm2 restart solomon-api
```

### Database Backups
```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore
mongorestore --uri="mongodb+srv://..." ./backup
```

### Update Deployment
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Restart
pm2 restart solomon-api
```

---

## Troubleshooting

### Server won't start
- Check logs: `pm2 logs`
- Verify environment variables
- Check MongoDB connection
- Ensure port 4000 is available

### Admin panel shows API errors
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on server
- Verify Firebase config

### Mobile app can't connect
- Check API URL in `app_constants.dart`
- Verify SSL certificate is valid
- Check Firebase configuration

---

For additional help, refer to:
- [Developer Manual](../developer-manual.md)
- [API Reference](./api-reference.md)
- [Firebase Setup Guide](../firebase-setup.md)
