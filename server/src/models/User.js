const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        // Only for admin users not using Firebase directly
    },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'teacher', 'accountant'],
        required: true
    },
    firebaseUid: {
        type: String,
        sparse: true, // Allows null but must be unique if present
        index: true
    },
    phone: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
