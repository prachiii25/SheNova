import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Spinner } from './components/ui';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded Pages for optimized bundle splitting & faster page loads
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const SkillGap = lazy(() => import('./pages/SkillGap'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Interview = lazy(() => import('./pages/Interview'));
const Learning = lazy(() => import('./pages/Learning'));
const Community = lazy(() => import('./pages/Community'));
const Profile = lazy(() => import('./pages/Profile'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 animate-fadeIn">
    <Spinner size="lg" variant="primary" />
    <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-heading">
      Loading view...
    </span>
  </div>
);

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

      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
    </>
  );
}

export default App;
