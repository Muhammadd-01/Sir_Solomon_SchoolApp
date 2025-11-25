const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

router.get('/',
    firebaseAuthMiddleware,
    announcementController.getAllAnnouncements
);

router.post('/',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    announcementController.createAnnouncement
);

router.put('/:id',
    firebaseAuthMiddleware,
    requireRole('teacher', 'admin', 'superadmin'),
    announcementController.updateAnnouncement
);

router.delete('/:id',
    firebaseAuthMiddleware,
    requireRole('admin', 'superadmin'),
    announcementController.deleteAnnouncement
);

module.exports = router;
