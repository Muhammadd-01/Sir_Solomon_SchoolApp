const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['general', 'urgent', 'event', 'holiday', 'exam'],
        default: 'general'
    },
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'teachers', 'parents', 'specific_class'],
        default: 'all'
    },
    targetClasses: [{
        class: String,
        section: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [{
        filename: String,
        url: String,
        size: Number
    }],
    publishedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    sendNotification: {
        type: Boolean,
        default: true
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    }
}, {
    timestamps: true
});

// Index for querying announcements
announcementSchema.index({ publishedAt: -1 });
announcementSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
