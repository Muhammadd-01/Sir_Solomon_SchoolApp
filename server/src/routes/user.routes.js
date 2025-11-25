const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Create Admin (Super Admin only)
router.post('/admin', verifyToken, requireRole(['super-admin']), userController.createAdmin);

// Create Teacher (Super Admin only)
router.post('/teacher', verifyToken, requireRole(['super-admin']), userController.createTeacher);

// Create Student (Admin or Super Admin)
router.post('/student', verifyToken, requireRole(['super-admin', 'admin']), userController.createStudent);

// Update User Role (Super Admin only)
router.put('/:uid/role', verifyToken, requireRole(['superadmin']), userController.updateUserRole);

module.exports = router;
