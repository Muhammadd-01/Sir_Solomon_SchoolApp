const { auth, db } = require('../config/firebase');

/**
 * Initialize Super Admin Account
 * Checks if a user with SUPER_ADMIN_EMAIL exists.
 * If not, creates it and assigns 'super-admin' role in Firestore.
 */
exports.initSuperAdmin = async () => {
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@school.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';

    try {
        // Check if user exists
        try {
            await auth.getUserByEmail(email);
            console.log('Super Admin account already exists.');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('Creating Super Admin account...');
                // Create user
                const userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: 'Super Admin',
                });

                // Set role in Firestore
                await db.collection('users').doc(userRecord.uid).set({
                    email: email,
                    role: 'super-admin',
                    displayName: 'Super Admin',
                    createdAt: new Date().toISOString(),
                    createdBy: 'system'
                });

                console.log(`Super Admin created successfully: ${email}`);
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error initializing Super Admin:', error);
    }
};

/**
 * Login Proxy (Optional)
 * In this architecture, frontend logs in directly to Firebase.
 * This endpoint can be used to verify tokens or exchange custom tokens if needed.
 */
exports.verifyToken = async (req, res) => {
    // Middleware already verified the token and attached user to req.user
    res.status(200).json({
        message: 'Token is valid',
        user: req.user
    });
};
