const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

router.get('/',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    teacherController.getAllTeachers
);

router.get('/:id',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    teacherController.getTeacherById
);

router.post('/',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    teacherController.createTeacher
);

router.put('/:id',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    teacherController.updateTeacher
);

router.delete('/:id',
    firebaseAuthMiddleware,
    requireRole('superadmin'),
    teacherController.deleteTeacher
);

module.exports = router;
