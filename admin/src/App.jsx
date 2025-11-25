import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import Assignments from './pages/Assignments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './index.css';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <Teachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees"
              element={
                <ProtectedRoute>
                  <Fees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
