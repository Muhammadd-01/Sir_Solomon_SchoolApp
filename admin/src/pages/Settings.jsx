import React, { useState } from 'react';
import api from '../services/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        schoolName: "Solomon's Secondary School",
        email: 'admin@solomon.school',
        phone: '+92-300-1234567',
        address: '123 School Street, Karachi, Pakistan',
        academicYear: '2024-2025',
        sessionStart: '2024-04-01',
        sessionEnd: '2025-03-31',
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
    });

    const handleSave = async () => {
        try {
            // TODO: Save settings to backend
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

            {/* School Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">School Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={settings.schoolName}
                            onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                        <input
                            type="text"
                            value={settings.academicYear}
                            onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Academic Session */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Academic Session</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Start Date</label>
                        <input
                            type="date"
                            value={settings.sessionStart}
                            onChange={(e) => setSettings({ ...settings, sessionStart: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session End Date</label>
                        <input
                            type="date"
                            value={settings.sessionEnd}
                            onChange={(e) => setSettings({ ...settings, sessionEnd: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                            className="mr-3"
                        />
                        <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                            Email Notifications
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="pushNotifications"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="mr-3"
                        />
                        <label htmlFor="pushNotifications" className="text-sm text-gray-700">
                            Push Notifications
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="smsNotifications"
                            checked={notifications.smsNotifications}
                            onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                            className="mr-3"
                        />
                        <label htmlFor="smsNotifications" className="text-sm text-gray-700">
                            SMS Notifications
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default Settings;
