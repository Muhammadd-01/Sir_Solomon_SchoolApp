const { auth, db } = require('../config/firebase');

/**
 * Verify Firebase ID Token
 */
exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

/**
 * Require specific role(s)
 * Checks the 'role' field in the 'users' Firestore collection
 */
exports.requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            }

            const userDoc = await db.collection('users').doc(req.user.uid).get();

            if (!userDoc.exists) {
                return res.status(403).json({ error: 'Forbidden: User profile not found' });
            }

            const userData = userDoc.data();
            const userRole = userData.role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            // Attach full user profile to request for convenience
            req.userProfile = userData;
            next();
        } catch (error) {
            console.error('Role verification error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};
