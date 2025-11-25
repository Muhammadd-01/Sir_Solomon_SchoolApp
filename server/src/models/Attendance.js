const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    method: {
        type: String,
        enum: ['qr', 'manual', 'barcode', 'face'],
        default: 'manual'
    },
    records: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        deviceId: String,
        geo: {
            lat: Number,
            lng: Number
        }
    }],
    notes: String,
    locked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for querying attendance by class and date
attendanceSchema.index({ class: 1, section: 1, date: -1 });
attendanceSchema.index({ date: -1 });

// Virtual for total students
attendanceSchema.virtual('totalStudents').get(function () {
    return this.records.length;
});

// Virtual for present count
attendanceSchema.virtual('presentCount').get(function () {
    return this.records.filter(r => r.status === 'present').length;
});

// Virtual for absent count
attendanceSchema.virtual('absentCount').get(function () {
    return this.records.filter(r => r.status === 'absent').length;
});

// Virtual for late count
attendanceSchema.virtual('lateCount').get(function () {
    return this.records.filter(r => r.status === 'late').length;
});

attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
