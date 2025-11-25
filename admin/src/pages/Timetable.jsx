import React from 'react';
import { useNavigate } from 'react-router-dom';

const Timetable = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
                <button
                    onClick={() => alert('Timetable builder coming soon!')}
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition"
                >
                    + Create Timetable
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Timetable Management</h2>
                <p className="text-gray-600 mb-6">
                    Visual timetable builder and editor will be available here.
                </p>
                <p className="text-sm text-gray-500">
                    Features: Drag-and-drop schedule builder, teacher assignment, room allocation, conflict detection
                </p>
            </div>
        </div>
    );
};

export default Timetable;
