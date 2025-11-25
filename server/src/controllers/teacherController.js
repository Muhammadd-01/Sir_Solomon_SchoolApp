const Teacher = require('../models/Teacher');

/**
 * Get all teachers
 */
exports.getAllTeachers = async (req, res) => {
    try {
        const { subject, active, search } = req.query;
        const filter = {};

        if (subject) filter.subjects = subject;
        if (active !== undefined) filter.active = active === 'true';
        if (search) filter.$text = { $search: search };

        const teachers = await Teacher.find(filter).sort({ 'name.first': 1 });

        res.json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Get single teacher by ID
 */
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Not found', message: 'Teacher not found' });
        }

        res.json({ success: true, data: teacher });
    } catch (error) {
        console.error('Get teacher error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Create new teacher
 */
exports.createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();

        res.status(201).json({
            success: true,
            message: 'Teacher created successfully',
            data: teacher
        });
    } catch (error) {
        console.error('Create teacher error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate', message: 'Teacher ID or email already exists' });
        }
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Update teacher
 */
exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!teacher) {
            return res.status(404).json({ error: 'Not found', message: 'Teacher not found' });
        }

        res.json({
            success: true,
            message: 'Teacher updated successfully',
            data: teacher
        });
    } catch (error) {
        console.error('Update teacher error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Delete teacher
 */
exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Not found', message: 'Teacher not found' });
        }

        res.json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};
