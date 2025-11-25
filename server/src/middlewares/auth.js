const { admin } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token
 * Attaches decoded user data to req.firebaseUser
 */
const firebaseAuthMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Attach user data to request
        req.firebaseUser = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            role: decodedToken.role || null, // Custom claim
            emailVerified: decodedToken.email_verified
        };

        next();
    } catch (error) {
        console.error('Firebase token verification error:', error.message);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Middleware to require specific role(s)
 * Must be used after firebaseAuthMiddleware
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.firebaseUser) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        const userRole = req.firebaseUser.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = { firebaseAuthMiddleware, requireRole };
