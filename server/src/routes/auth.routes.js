const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Route to verify token (useful for frontend to check session validity)
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
