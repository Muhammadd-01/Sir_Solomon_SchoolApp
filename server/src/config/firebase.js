const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
        const serviceAccount = require(path.resolve(serviceAccountPath));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${serviceAccount.project_id}.appspot.com`
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization failed:', error.message);
        console.error('⚠️  Make sure serviceAccountKey.json exists and FIREBASE_SERVICE_ACCOUNT_PATH is set correctly');
        // Don't exit process - allow server to start for development
    }
};

module.exports = { admin, initializeFirebase };
