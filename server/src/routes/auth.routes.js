const express = require('express');
const router = express.Router();
const { autoRegisterSuperadmin } = require('../middleware/autoRegister');
const admin = require('../config/firebase');
const User = require('../models/User');

// Health check endpoint (public)
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Solomon School API'
    });
});

// Login endpoint with auto-registration
router.post('/login', autoRegisterSuperadmin, async (req, res) => {
    try {
        const user = req.user;

        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                firebaseUid: user.firebaseUid,
            },
            message: user.role === 'superadmin' ? 'Welcome, Superadmin!' : 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token endpoint
router.post('/verify', autoRegisterSuperadmin, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                _id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
            },
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
