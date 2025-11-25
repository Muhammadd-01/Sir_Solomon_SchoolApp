const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        enum: ['sports', 'cultural', 'academic', 'holiday', 'parent_meeting', 'other'],
        default: 'other'
    },
    startDate: {
        type: Date,
        required: true,
        index: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    gallery: [{
        filename: String,
        url: String,
        caption: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, {
    timestamps: true
});

// Index for querying events
eventSchema.index({ startDate: -1 });
eventSchema.index({ status: 1, startDate: -1 });

module.exports = mongoose.model('Event', eventSchema);
