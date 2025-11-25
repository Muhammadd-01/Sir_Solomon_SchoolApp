const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Term 3', 'Final'],
        required: true
    },
    subjects: [{
        subject: { type: String, required: true },
        marksObtained: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        grade: { type: String }, // A+, A, B+, etc.
        remarks: String
    }],
    totalMarks: Number,
    percentage: Number,
    overallGrade: String,
    rank: Number,
    remarks: String,
    publishedAt: Date
}, {
    timestamps: true
});

// Compound index for unique grade per student/term/year
gradeSchema.index({ studentId: 1, term: 1, academicYear: 1 }, { unique: true });

// Calculate totals before saving
gradeSchema.pre('save', function (next) {
    if (this.subjects && this.subjects.length > 0) {
        const total = this.subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
        const maxTotal = this.subjects.reduce((sum, sub) => sum + sub.totalMarks, 0);
        this.totalMarks = total;
        this.percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0;

        // Calculate overall grade
        const percent = parseFloat(this.percentage);
        if (percent >= 90) this.overallGrade = 'A+';
        else if (percent >= 80) this.overallGrade = 'A';
        else if (percent >= 70) this.overallGrade = 'B+';
        else if (percent >= 60) this.overallGrade = 'B';
        else if (percent >= 50) this.overallGrade = 'C';
        else if (percent >= 40) this.overallGrade = 'D';
        else this.overallGrade = 'F';
    }
    next();
});

module.exports = mongoose.model('Grade', gradeSchema);
