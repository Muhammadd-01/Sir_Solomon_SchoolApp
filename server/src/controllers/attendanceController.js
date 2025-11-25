const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

/**
 * Create new attendance session
 */
exports.createSession = async (req, res) => {
    try {
        const { sessionId, class: className, section, subject, date, method } = req.body;
        const teacherId = req.firebaseUser.uid; // From auth middleware

        const session = new Attendance({
            sessionId,
            class: className,
            section,
            subject,
            date: date || new Date(),
            takenBy: teacherId,
            method: method || 'manual',
            records: []
        });

        await session.save();

        res.status(201).json({
            success: true,
            message: 'Attendance session created',
            data: session
        });
    } catch (error) {
        console.error('Create session error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate', message: 'Session ID already exists' });
        }
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Mark attendance (batch or single)
 */
exports.markAttendance = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { records } = req.body; // Array of { studentId, status, timestamp, deviceId, geo }

        const session = await Attendance.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Not found', message: 'Session not found' });
        }

        if (session.locked) {
            return res.status(400).json({ error: 'Locked', message: 'Session is locked' });
        }

        // Add or update records
        for (const record of records) {
            const existingIndex = session.records.findIndex(
                r => r.studentId.toString() === record.studentId
            );

            if (existingIndex >= 0) {
                // Update existing record
                session.records[existingIndex] = {
                    ...session.records[existingIndex],
                    ...record,
                    timestamp: new Date()
                };
            } else {
                // Add new record
                session.records.push({
                    ...record,
                    timestamp: record.timestamp || new Date()
                });
            }
        }

        await session.save();

        // Emit real-time event (will be handled by socket.io)
        if (req.app.get('io')) {
            req.app.get('io').emit('attendance:updated', {
                sessionId,
                class: session.class,
                section: session.section,
                presentCount: session.presentCount,
                totalStudents: session.totalStudents
            });
        }

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: session
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Get attendance session by ID
 */
exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Attendance.findOne({ sessionId })
            .populate('takenBy', 'name email')
            .populate('records.studentId', 'studentId name class section');

        if (!session) {
            return res.status(404).json({ error: 'Not found', message: 'Session not found' });
        }

        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Get attendance report
 */
exports.getReport = async (req, res) => {
    try {
        const { class: className, section, from, to } = req.query;

        const filter = {};
        if (className) filter.class = className;
        if (section) filter.section = section;
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const sessions = await Attendance.find(filter)
            .populate('takenBy', 'name')
            .sort({ date: -1 });

        res.json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Lock attendance session (prevent further edits)
 */
exports.lockSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Attendance.findOneAndUpdate(
            { sessionId },
            { locked: true },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ error: 'Not found', message: 'Session not found' });
        }

        res.json({
            success: true,
            message: 'Session locked successfully',
            data: session
        });
    } catch (error) {
        console.error('Lock session error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};
