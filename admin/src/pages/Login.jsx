import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-accent flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="glass rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo & Title */}
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-navy">S</span>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text">Solomon's School</h1>
                        <p className="text-gray-600">Admin Panel</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="admin@solomon.school"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <span className="spinner mr-2"></span>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Default Credentials Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                        <p className="font-semibold text-blue-900 mb-2">Default Credentials:</p>
                        <p className="text-blue-700">Email: admin@solomon.school</p>
                        <p className="text-blue-700">Password: Admin@123456</p>
                        <p className="text-blue-600 text-xs mt-2">⚠️ Change password after first login</p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/80 text-sm mt-6">
                    © 2024 Solomon's Secondary School. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
