import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  Target,
  FileText,
  Briefcase,
  Mic,
  GraduationCap,
  Users,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Skill Gap Analyzer', path: '/skill-gap', icon: Target },
    { name: 'Resume Builder', path: '/resume-builder', icon: FileText },
    { name: 'Returnship Jobs', path: '/jobs', icon: Briefcase },
    { name: 'AI Mock Interview', path: '/interview', icon: Mic },
    { name: 'Learning Hub', path: '/learning', icon: GraduationCap },
    { name: 'Sisterhood Circle', path: '/community', icon: Users },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const currentItem = navigationItems.find((item) => item.path === location.pathname) || {
    name: 'SheNova Companion',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-border sticky top-0 h-screen select-none z-30">
        {/* Brand */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-soft-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-ink leading-none">
                SheNova
              </span>
              <span className="block text-[10px] text-primary-600 font-semibold tracking-wider uppercase mt-1">
                Career Companion
              </span>
            </div>
          </NavLink>
        </div>

        {/* Demo status alert */}
        <div className="px-4 py-3 bg-secondary/40 border-b border-primary-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-primary-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Demo Mode Active</span>
          </div>
          <Badge variant="demo" size="sm">Sample</Badge>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-soft-sm'
                      : 'text-ink-light hover:text-ink hover:bg-surface-subtle'
                  }`
                }
              >
                <Icon className="w-4 h-4 opacity-80" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-surface-border bg-surface-subtle/30">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink truncate font-heading">{user?.name || 'Ananya Sharma'}</p>
              <p className="text-[11px] text-ink-muted truncate">{user?.careerBreakReason || 'Returner'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 justify-start"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-surface-border sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-ink-light hover:bg-surface-subtle"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-muted hidden sm:inline">Workspace</span>
              <ChevronRight className="w-4 h-4 text-ink-subtle hidden sm:inline" />
              <h1 className="font-heading font-bold text-ink text-base md:text-lg">
                {currentItem.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-ink-muted hover:text-primary-600 transition-colors px-2 py-1 rounded-lg hover:bg-surface-subtle"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>

            <button
              type="button"
              className="p-2 rounded-xl text-ink-light hover:text-ink hover:bg-surface-subtle relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
            </button>

            <NavLink to="/profile" className="flex items-center gap-2 pl-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
              />
            </NavLink>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto pb-16 lg:pb-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border px-3 py-2 flex items-center justify-around z-30 shadow-soft-lg">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-1 rounded-lg text-xs ${
                  isActive ? 'text-primary-600 font-semibold' : 'text-ink-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] truncate max-w-[56px]">{item.name.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-72 bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-4 border-b border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-lg text-ink">SheNova</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-ink-subtle hover:bg-surface-subtle"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-secondary/50 border-b border-primary-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-800">Sample Returner Portal</span>
                <Badge variant="demo" size="sm">Demo</Badge>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-ink-light hover:bg-surface-subtle'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-primary-500" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-surface-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-600 hover:text-rose-700 justify-center"
                  leftIcon={<LogOut className="w-4 h-4" />}
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    handleLogout();
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
