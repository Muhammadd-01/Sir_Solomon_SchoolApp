const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/verify-firebase-token
 * @desc    Verify Firebase ID token and get/create user
 * @access  Public
 */
router.post('/verify-firebase-token', authController.verifyFirebaseToken);

/**
 * @route   POST /api/auth/admin-login
 * @desc    Admin login with email/password (optional)
 * @access  Public
 */
router.post('/admin-login', authController.adminLogin);

module.exports = router;
