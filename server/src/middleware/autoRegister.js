const admin = require('../config/firebase');
const User = require('../models/User');

// Superadmin configuration - CHANGE PASSWORD IN FIREBASE CONSOLE
const SUPERADMIN_EMAIL = 'admin@solomon.school';

/**
 * Auto-register middleware
 * Automatically creates superadmin user on first login
 */
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
                    error: 'User not found. Please contact administrator to create your account.'
                });
            }
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        // Attach user to request
        req.user = user;
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        console.error('Auto-register error:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
}

module.exports = { autoRegisterSuperadmin };
