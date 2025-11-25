const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

router.get('/',
    firebaseAuthMiddleware,
    timetableController.getTimetable
);

router.post('/',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    timetableController.createTimetable
);

router.put('/:id',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    timetableController.updateTimetable
);

module.exports = router;
