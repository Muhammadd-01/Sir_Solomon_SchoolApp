import React from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const reports = [
        { id: 1, title: 'Attendance Report', description: 'Monthly attendance statistics by class', icon: '📊' },
        { id: 2, title: 'Fee Collection Report', description: 'Fee payment status and pending amounts', icon: '💰' },
        { id: 3, title: 'Academic Performance', description: 'Student grades and performance analytics', icon: '📈' },
        { id: 4, title: 'Teacher Performance', description: 'Teaching hours and class assignments', icon: '👨‍🏫' },
        { id: 5, title: 'Student Enrollment', description: 'Enrollment trends and demographics', icon: '👥' },
        { id: 6, title: 'Assignment Completion', description: 'Assignment submission and grading stats', icon: '✅' },
    ];

    const handleGenerateReport = (reportTitle) => {
        alert(`Generating ${reportTitle}... This feature will be available soon!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="text-4xl mb-4">{report.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                        <button
                            onClick={() => handleGenerateReport(report.title)}
                            className="w-full bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg transition"
                        >
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📄 Export Options</h3>
                <p className="text-sm text-blue-700 mb-4">
                    All reports can be exported in multiple formats:
                </p>
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-white rounded text-sm font-medium text-gray-700">PDF</span>
                    <span className="px-3 py-1 bg-white rounded text-sm font-medium text-gray-700">Excel</span>
                    <span className="px-3 py-1 bg-white rounded text-sm font-medium text-gray-700">CSV</span>
                </div>
            </div>
        </div>
    );
};

export default Reports;
