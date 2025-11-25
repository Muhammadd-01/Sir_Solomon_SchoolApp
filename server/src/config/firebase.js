const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// In production, use environment variables or a secure secret manager
// For development, we use the service account file
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

try {
    admin.initializeApp({
        credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();
const storage = admin.storage();

module.exports = { admin, db, auth, messaging, storage };
