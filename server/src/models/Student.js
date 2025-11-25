const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'Other'],
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    guardians: [{
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }
    }],
    medical: {
        allergies: [String],
        notes: String
    },
    photoUrl: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated', 'transferred'],
        default: 'active'
    },
    firebaseUid: {
        type: String,
        sparse: true,
        index: true
    },
    admissionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

// Virtual for age
studentSchema.virtual('age').get(function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Index for searching
studentSchema.index({ 'name.first': 'text', 'name.last': 'text', studentId: 'text' });

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
