const { admin } = require('../config/firebase');
const User = require('../models/User');

/**
 * Verify Firebase ID token and return user data
 */
exports.verifyFirebaseToken = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'Bad request', message: 'ID token required' });
        }

        // Verify token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Check if user exists in our database
        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        // If user doesn't exist and has appropriate role claim, create them
        if (!user && decodedToken.role) {
            user = new User({
                email: decodedToken.email,
                name: {
                    first: decodedToken.name?.split(' ')[0] || 'User',
                    last: decodedToken.name?.split(' ').slice(1).join(' ') || ''
                },
                role: decodedToken.role,
                firebaseUid: decodedToken.uid
            });
            await user.save();
        }

        res.json({
            success: true,
            message: 'Token verified successfully',
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: decodedToken.role || user?.role,
                name: decodedToken.name,
                emailVerified: decodedToken.email_verified
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
};

/**
 * Admin login (optional - for local admin accounts)
 */
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // TODO: Implement bcrypt password verification
        // This is a placeholder for local admin login

        res.status(501).json({
            error: 'Not implemented',
            message: 'Use Firebase authentication instead'
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};
