const Assignment = require('../models/Assignment');

exports.getAllAssignments = async (req, res) => {
    try {
        const { class: className, section, subject, status } = req.query;
        const filter = {};

        if (className) filter.class = className;
        if (section) filter.section = section;
        if (subject) filter.subject = subject;
        if (status) filter.status = status;

        const assignments = await Assignment.find(filter)
            .populate('teacherId', 'name email')
            .sort({ dueDate: -1 });

        res.json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        const assignment = new Assignment({
            ...req.body,
            teacherId: req.firebaseUser.uid
        });
        await assignment.save();

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.submitAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { files } = req.body;
        const studentId = req.firebaseUser.uid;

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ error: 'Not found' });
        }

        assignment.submissions.push({
            studentId,
            files,
            status: new Date() > assignment.dueDate ? 'late' : 'submitted'
        });

        await assignment.save();
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        const { id, submissionId } = req.params;
        const { marksObtained, feedback } = req.body;

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ error: 'Not found' });
        }

        const submission = assignment.submissions.id(submissionId);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        submission.marksObtained = marksObtained;
        submission.feedback = feedback;
        submission.status = 'graded';

        await assignment.save();
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = exports;
