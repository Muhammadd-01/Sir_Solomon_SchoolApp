const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
    try {
        const { class: className, section, day, academicYear } = req.query;
        const filter = {};

        if (className) filter.class = className;
        if (section) filter.section = section;
        if (day) filter.day = day;
        if (academicYear) filter.academicYear = academicYear;

        const timetables = await Timetable.find(filter)
            .populate('slots.teacherId', 'name subjects');

        res.json({ success: true, count: timetables.length, data: timetables });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.createTimetable = async (req, res) => {
    try {
        const timetable = new Timetable(req.body);
        await timetable.save();

        res.status(201).json({ success: true, data: timetable });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate', message: 'Timetable already exists for this class/section/day' });
        }
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!timetable) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

module.exports = exports;
