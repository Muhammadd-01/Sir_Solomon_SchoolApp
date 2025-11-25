import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;

            const response = await api.get('/teachers', { params });
            setTeachers(response.data.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTeachers();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;

        try {
            await api.delete(`/teachers/${id}`);
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Failed to delete teacher');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
                <button
                    onClick={() => navigate('/teachers/new')}
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition"
                >
                    + Add Teacher
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-lg transition"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center">Loading...</div>
                ) : teachers.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500">
                        No teachers found.
                    </div>
                ) : (
                    teachers.map((teacher) => (
                        <div key={teacher._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {teacher.name.first[0]}{teacher.name.last[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {teacher.name.first} {teacher.name.last}
                                    </h3>
                                    <p className="text-sm text-gray-500">{teacher.teacherId}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">📧</span>
                                    {teacher.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">📱</span>
                                    {teacher.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">📚</span>
                                    {teacher.subjects.join(', ')}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">🏫</span>
                                    {teacher.assignedClasses.length} classes assigned
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/teachers/${teacher._id}`)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/teachers/${teacher._id}/edit`)}
                                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded text-sm transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(teacher._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Teachers;
