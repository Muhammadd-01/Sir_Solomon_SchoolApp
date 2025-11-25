const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true,
        index: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    totalMarks: {
        type: Number,
        default: 100
    },
    attachments: [{
        filename: String,
        url: String,
        size: Number
    }],
    submissions: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        files: [{
            filename: String,
            url: String,
            size: Number
        }],
        marksObtained: Number,
        feedback: String,
        status: {
            type: String,
            enum: ['submitted', 'graded', 'late'],
            default: 'submitted'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for querying assignments
assignmentSchema.index({ class: 1, section: 1, dueDate: -1 });
assignmentSchema.index({ teacherId: 1, createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
