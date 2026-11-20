import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  Compass,
  Briefcase,
  Users,
  LogIn,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Roadmap & Skills', path: '/roadmap', icon: Compass },
    { name: 'Returnship Jobs', path: '/jobs', icon: Briefcase },
    { name: 'AI Interview', path: '/interview', icon: Sparkles },
    { name: 'Sisterhood Community', path: '/community', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-2xl text-ink tracking-tight flex items-center gap-1.5">
              SheNova
              <span className="w-2 h-2 rounded-full bg-accent-500 inline-block"></span>
            </span>
            <span className="text-[11px] font-medium text-ink-muted -mt-1 hidden sm:inline-block">
              New Opportunities. Endless Possibilities.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary-700 bg-primary-50 font-semibold'
                    : 'text-ink-light hover:text-primary-700 hover:bg-surface-subtle'
                }`
              }
            >
              <link.icon className="w-4 h-4 opacity-75" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
              <Link to="/profile" className="flex items-center gap-2 pl-2">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-200"
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Restart My Career
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-ink-light hover:text-ink hover:bg-surface-subtle transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-surface-border bg-white px-4 pt-3 pb-6 shadow-soft-lg space-y-4"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
                      isActive
                        ? 'text-primary-700 bg-primary-50 font-semibold'
                        : 'text-ink-light hover:bg-surface-subtle'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5 text-primary-500" />
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-surface-border flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    leftIcon={<LayoutDashboard className="w-4 h-4" />}
                  >
                    Open Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                  >
                    Restart My Career
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
