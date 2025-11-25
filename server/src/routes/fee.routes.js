const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { firebaseAuthMiddleware, requireRole } = require('../middlewares/auth');

router.get('/',
    firebaseAuthMiddleware,
    feeController.getAllFees
);

router.post('/',
    firebaseAuthMiddleware,
    requireRole('admin', 'accountant'),
    feeController.createFee
);

router.post('/:id/payment',
    firebaseAuthMiddleware,
    requireRole('admin', 'accountant'),
    feeController.recordPayment
);

module.exports = router;
