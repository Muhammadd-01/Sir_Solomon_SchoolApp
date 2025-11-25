const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

router.get('/',
    firebaseAuthMiddleware,
    assignmentController.getAllAssignments
);

router.post('/',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin'),
    assignmentController.createAssignment
);

router.post('/:id/submit',
    firebaseAuthMiddleware,
    requireRole('student'),
    assignmentController.submitAssignment
);

router.put('/:id/submissions/:submissionId/grade',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin'),
    assignmentController.gradeSubmission
);

module.exports = router;
