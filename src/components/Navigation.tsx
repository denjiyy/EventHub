import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Search, Plus, Ticket, Home, ChevronRight, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

export function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? 'text-violet-600 bg-violet-50'
        : 'text-gray-700 hover:text-violet-600 hover:bg-violet-50'
    }`;
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-xl">
                <Ticket className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </NavLink>
          
          <div className="flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>
            
            <NavLink to="/events" className={navLinkClass}>
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/bookings" className={navLinkClass}>
                  <Ticket className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </NavLink>
                
                <NavLink to="/create" className={navLinkClass}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-50">
                  <User className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-violet-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
}
