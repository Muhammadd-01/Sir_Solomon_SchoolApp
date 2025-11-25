const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true,
        index: true
    },
    section: {
        type: String,
        required: true,
        index: true
    },
    academicYear: {
        type: String,
        required: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    slots: [{
        startTime: { type: String, required: true }, // "09:00"
        endTime: { type: String, required: true },   // "09:40"
        subject: { type: String, required: true },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true
        },
        room: String
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for unique timetable per class/section/day
timetableSchema.index({ class: 1, section: 1, day: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
