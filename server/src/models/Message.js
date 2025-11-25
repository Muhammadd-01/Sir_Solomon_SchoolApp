const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String, // Firebase UID
        required: true,
        index: true
    },
    senderType: {
        type: String,
        enum: ['student', 'parent', 'teacher', 'admin'],
        required: true
    },
    receiverId: {
        type: String, // Firebase UID
        required: true,
        index: true
    },
    receiverType: {
        type: String,
        enum: ['student', 'parent', 'teacher', 'admin'],
        required: true
    },
    subject: String,
    content: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        url: String,
        size: Number
    }],
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    threadId: {
        type: String,
        index: true
    }
}, {
    timestamps: true
});

// Compound index for conversation threads
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
