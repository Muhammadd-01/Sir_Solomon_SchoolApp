import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'general',
        targetAudience: 'all',
        sendNotification: true,
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get('/announcements');
            setAnnouncements(response.data.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', formData);
            setShowForm(false);
            setFormData({
                title: '',
                content: '',
                type: 'general',
                targetAudience: 'all',
                sendNotification: true,
            });
            fetchAnnouncements();
            alert('Announcement created successfully!');
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition"
                >
                    {showForm ? 'Cancel' : '+ New Announcement'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                >
                                    <option value="general">General</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="event">Event</option>
                                    <option value="exam">Exam</option>
                                    <option value="holiday">Holiday</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <select
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="students">Students Only</option>
                                    <option value="parents">Parents Only</option>
                                    <option value="teachers">Teachers Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="sendNotification"
                                checked={formData.sendNotification}
                                onChange={(e) => setFormData({ ...formData, sendNotification: e.target.checked })}
                                className="mr-2"
                            />
                            <label htmlFor="sendNotification" className="text-sm text-gray-700">
                                Send push notification
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition"
                        >
                            Publish Announcement
                        </button>
                    </form>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">Loading...</div>
                ) : announcements.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No announcements yet. Create one to get started!
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div key={announcement._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(announcement.publishedAt).toLocaleDateString()} • {announcement.targetAudience}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.type === 'urgent' ? 'bg-red-100 text-red-800' :
                                            announcement.type === 'event' ? 'bg-blue-100 text-blue-800' :
                                                announcement.type === 'exam' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {announcement.type}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-700">{announcement.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Announcements;
