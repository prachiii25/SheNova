import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import SkillGap from './pages/SkillGap';
import ResumeBuilder from './pages/ResumeBuilder';
import Jobs from './pages/Jobs';
import Interview from './pages/Interview';
import Learning from './pages/Learning';
import Community from './pages/Community';
import Profile from './pages/Profile';

export function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#292536',
            color: '#FAF9FC',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 25px -3px rgba(41, 37, 54, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#F28BA8',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes with Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Authenticated Workspace Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
