import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        attendanceRate: 0,
        pendingFees: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // TODO: Create a stats endpoint in backend
            // For now, using placeholder data
            setStats({
                totalStudents: 450,
                totalTeachers: 35,
                attendanceRate: 92,
                pendingFees: 125000,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon="👨‍🎓"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Teachers"
                    value={stats.totalTeachers}
                    icon="👨‍🏫"
                    color="bg-green-500"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendanceRate}%`}
                    icon="✅"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Pending Fees"
                    value={`₨${stats.pendingFees.toLocaleString()}`}
                    icon="💰"
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
                    <div className="space-y-3">
                        <ActivityItem
                            title="Sports Day Announcement"
                            time="2 hours ago"
                            type="announcement"
                        />
                        <ActivityItem
                            title="Exam Schedule Published"
                            time="5 hours ago"
                            type="exam"
                        />
                        <ActivityItem
                            title="Parent-Teacher Meeting"
                            time="1 day ago"
                            type="event"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                    <div className="space-y-3">
                        <TaskItem
                            title="Review Leave Requests"
                            count={8}
                            priority="high"
                        />
                        <TaskItem
                            title="Grade Submissions Pending"
                            count={15}
                            priority="medium"
                        />
                        <TaskItem
                            title="Fee Reminders to Send"
                            count={23}
                            priority="low"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {icon}
            </div>
        </div>
    </div>
);

const ActivityItem = ({ title, time, type }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
        <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500">{time}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${type === 'urgent' ? 'bg-red-100 text-red-600' :
                type === 'exam' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
            }`}>
            {type}
        </span>
    </div>
);

const TaskItem = ({ title, count, priority }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
        <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500">{count} items</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${priority === 'high' ? 'bg-red-100 text-red-600' :
                priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
            }`}>
            {priority}
        </span>
    </div>
);

export default Dashboard;
