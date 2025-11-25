import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Attendance = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterClass, setFilterClass] = useState('');
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchSessions();
    }, [filterClass, filterDate]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterClass) params.class = filterClass;
            if (filterDate) params.date = filterDate;

            const response = await api.get('/attendance/sessions', { params });
            setSessions(response.data.data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceStats = (session) => {
        const total = session.records?.length || 0;
        const present = session.records?.filter(r => r.status === 'present').length || 0;
        const absent = session.records?.filter(r => r.status === 'absent').length || 0;
        const late = session.records?.filter(r => r.status === 'late').length || 0;

        return { total, present, absent, late };
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                        <option value="">All Classes</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                    </select>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <button
                        onClick={fetchSessions}
                        className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">Loading...</div>
                ) : sessions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No attendance sessions found for the selected filters.
                    </div>
                ) : (
                    sessions.map((session) => {
                        const stats = getAttendanceStats(session);
                        const attendanceRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;

                        return (
                            <div key={session._id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {session.class} - {session.section} • {session.subject}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(session.date).toLocaleDateString()} • {session.method.toUpperCase()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {session.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Total Students</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-xs text-green-600 mb-1">Present</p>
                                        <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-3">
                                        <p className="text-xs text-red-600 mb-1">Absent</p>
                                        <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-3">
                                        <p className="text-xs text-yellow-600 mb-1">Late</p>
                                        <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-xs text-blue-600 mb-1">Attendance Rate</p>
                                        <p className="text-2xl font-bold text-blue-700">{attendanceRate}%</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Attendance;
