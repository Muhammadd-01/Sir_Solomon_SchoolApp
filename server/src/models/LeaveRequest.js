const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    requestedBy: {
        type: String,
        enum: ['student', 'parent'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        enum: ['sick', 'casual', 'emergency', 'other'],
        default: 'casual'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    reviewComments: String,
    attachments: [{
        filename: String,
        url: String
    }]
}, {
    timestamps: true
});

// Index for querying leave requests
leaveRequestSchema.index({ studentId: 1, createdAt: -1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
