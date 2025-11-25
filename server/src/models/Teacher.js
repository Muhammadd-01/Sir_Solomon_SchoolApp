const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    subjects: [{
        type: String,
        required: true
    }],
    assignedClasses: [{
        class: { type: String, required: true },
        section: { type: String, required: true }
    }],
    photoUrl: String,
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    active: {
        type: Boolean,
        default: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for full name
teacherSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

// Index for searching
teacherSchema.index({ 'name.first': 'text', 'name.last': 'text', teacherId: 'text' });

teacherSchema.set('toJSON', { virtuals: true });
teacherSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Teacher', teacherSchema);
