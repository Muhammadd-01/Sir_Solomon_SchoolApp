const Student = require('../models/Student');

/**
 * Get all students with optional filtering
 */
exports.getAllStudents = async (req, res) => {
    try {
        const { class: className, section, status, search } = req.query;
        const filter = {};

        if (className) filter.class = className;
        if (section) filter.section = section;
        if (status) filter.status = status;

        // Text search if provided
        if (search) {
            filter.$text = { $search: search };
        }

        const students = await Student.find(filter).sort({ 'name.first': 1 });

        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Get single student by ID
 */
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Not found', message: 'Student not found' });
        }

        res.json({ success: true, data: student });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Create new student
 */
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.error('Create student error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate', message: 'Student ID already exists' });
        }
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Update student
 */
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ error: 'Not found', message: 'Student not found' });
        }

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

/**
 * Delete student
 */
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Not found', message: 'Student not found' });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};
