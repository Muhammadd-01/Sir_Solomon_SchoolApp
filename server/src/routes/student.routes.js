const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @route   GET /api/students
 * @desc    Get all students with optional filters
 * @access  Protected (Teacher, Admin)
 */
router.get('/',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    studentController.getAllStudents
);

/**
 * @route   GET /api/students/:id
 * @desc    Get single student by ID
 * @access  Protected (Teacher, Admin)
 */
router.get('/:id',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    studentController.getStudentById
);

/**
 * @route   POST /api/students
 * @desc    Create new student
 * @access  Protected (Admin only)
 */
router.post('/',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    studentController.createStudent
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student
 * @access  Protected (Admin only)
 */
router.put('/:id',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    studentController.updateStudent
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Protected (SuperAdmin only)
 */
router.delete('/:id',
    firebaseAuthMiddleware,
    requireRole('superadmin'),
    studentController.deleteStudent
);

module.exports = router;
