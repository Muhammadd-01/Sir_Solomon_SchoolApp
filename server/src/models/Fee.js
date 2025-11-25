const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    academicYear: {
        type: String,
        required: true
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Term 3', 'Annual'],
        required: true
    },
    feeType: {
        type: String,
        enum: ['tuition', 'admission', 'exam', 'transport', 'library', 'sports', 'other'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue', 'partial'],
        default: 'pending',
        index: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    paidAt: Date,
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'online', 'cheque']
    },
    transactionId: String,
    receiptNumber: String,
    discount: {
        type: Number,
        default: 0
    },
    lateFee: {
        type: Number,
        default: 0
    },
    remarks: String
}, {
    timestamps: true
});

// Compound index for unique fee per student/term/type
feeSchema.index({ studentId: 1, academicYear: 1, term: 1, feeType: 1 });

// Virtual for balance
feeSchema.virtual('balance').get(function () {
    return this.amount + this.lateFee - this.discount - this.paidAmount;
});

// Update status based on payment
feeSchema.pre('save', function (next) {
    const balance = this.amount + this.lateFee - this.discount - this.paidAmount;

    if (balance <= 0) {
        this.status = 'paid';
    } else if (this.paidAmount > 0) {
        this.status = 'partial';
    } else if (new Date() > this.dueDate) {
        this.status = 'overdue';
    } else {
        this.status = 'pending';
    }

    next();
});

feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Fee', feeSchema);
