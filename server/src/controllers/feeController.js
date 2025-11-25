const Fee = require('../models/Fee');

exports.getAllFees = async (req, res) => {
    try {
        const { studentId, status, academicYear } = req.query;
        const filter = {};

        if (studentId) filter.studentId = studentId;
        if (status) filter.status = status;
        if (academicYear) filter.academicYear = academicYear;

        const fees = await Fee.find(filter)
            .populate('studentId', 'studentId name class section')
            .sort({ dueDate: -1 });

        res.json({ success: true, count: fees.length, data: fees });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.createFee = async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();

        res.status(201).json({ success: true, data: fee });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMethod, transactionId } = req.body;

        const fee = await Fee.findById(id);
        if (!fee) {
            return res.status(404).json({ error: 'Not found' });
        }

        fee.paidAmount += amount;
        fee.paidAt = new Date();
        fee.paymentMethod = paymentMethod;
        fee.transactionId = transactionId;
        fee.receiptNumber = `REC-${Date.now()}`;

        await fee.save();
        res.json({ success: true, data: fee });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = exports;
