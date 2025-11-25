import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { logout, userRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard', roles: ['admin', 'superadmin', 'teacher', 'accountant'] },
        { icon: '👨‍🎓', label: 'Students', path: '/students', roles: ['admin', 'superadmin', 'teacher'] },
        { icon: '👨‍🏫', label: 'Teachers', path: '/teachers', roles: ['admin', 'superadmin'] },
        { icon: '📅', label: 'Timetable', path: '/timetable', roles: ['admin', 'superadmin'] },
        { icon: '✅', label: 'Attendance', path: '/attendance', roles: ['admin', 'superadmin', 'teacher'] },
        { icon: '📝', label: 'Assignments', path: '/assignments', roles: ['admin', 'superadmin', 'teacher'] },
        { icon: '📢', label: 'Announcements', path: '/announcements', roles: ['admin', 'superadmin', 'teacher'] },
        { icon: '💰', label: 'Fees', path: '/fees', roles: ['admin', 'superadmin', 'accountant'] },
        { icon: '📊', label: 'Reports', path: '/reports', roles: ['admin', 'superadmin', 'accountant'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.includes(userRole)
    );

    return (
        <div className="w-64 bg-navy text-white h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-8">
                    <img src="/logo.jpg" alt="Logo" className="h-12 w-12 rounded-full" />
                    <div>
                        <h2 className="font-bold text-lg">Solomon's School</h2>
                        <p className="text-xs text-gray-300">Admin Panel</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {filteredMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-light transition duration-200"
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition duration-200 w-full text-left"
                    >
                        <span className="text-xl">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
