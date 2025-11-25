const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

/**
 * @route   POST /api/attendance/session
 * @desc    Create new attendance session
 * @access  Protected (Teacher, Admin)
 */
router.post('/session',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    attendanceController.createSession
);

/**
 * @route   POST /api/attendance/session/:sessionId/mark
 * @desc    Mark attendance for students (batch or single)
 * @access  Protected (Teacher, Admin)
 */
router.post('/session/:sessionId/mark',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    attendanceController.markAttendance
);

/**
 * @route   GET /api/attendance/session/:sessionId
 * @desc    Get attendance session details
 * @access  Protected (Teacher, Admin)
 */
router.get('/session/:sessionId',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    attendanceController.getSession
);

/**
 * @route   GET /api/attendance/report
 * @desc    Get attendance report with filters
 * @access  Protected (Teacher, Admin)
 */
router.get('/report',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin', 'accountant'),
    attendanceController.getReport
);

/**
 * @route   PUT /api/attendance/session/:sessionId/lock
 * @desc    Lock attendance session
 * @access  Protected (Admin only)
 */
router.put('/session/:sessionId/lock',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    attendanceController.lockSession
);

module.exports = router;
