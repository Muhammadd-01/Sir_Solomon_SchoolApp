const Announcement = require('../models/Announcement');
const { admin } = require('../config/firebase');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (type) filter.type = type;

        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'name email')
            .sort({ publishedAt: -1 });

        res.json({ success: true, count: announcements.length, data: announcements });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement({
            ...req.body,
            createdBy: req.firebaseUser.uid
        });
        await announcement.save();

        // Send FCM notification if requested
        if (announcement.sendNotification && !announcement.notificationSent) {
            try {
                const message = {
                    notification: {
                        title: announcement.title,
                        body: announcement.content.substring(0, 100)
                    },
                    data: {
                        type: 'announcement',
                        id: announcement._id.toString()
                    },
                    topic: 'announcements' // All users subscribed to this topic
                };

                await admin.messaging().send(message);
                announcement.notificationSent = true;
                await announcement.save();
            } catch (fcmError) {
                console.error('FCM error:', fcmError);
            }
        }

        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ success: true, message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = exports;
