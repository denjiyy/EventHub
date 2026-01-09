import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, Search, Plus, Ticket, Home, ChevronRight } from 'lucide-react';
import { useRouter } from '../context/Router';

export function Navigation() {
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate({ page: 'home' })}
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
          </button>
          
          <div className="flex items-center space-x-1">
            {[
              { icon: Home, label: 'Home', route: { page: 'home' as const } },
              { icon: Calendar, label: 'Events', route: { page: 'events' as const } },
              { icon: Ticket, label: 'Bookings', route: { page: 'bookings' as const } },
              { icon: Plus, label: 'Create', route: { page: 'create' as const } }
            ].map(({ icon: Icon, label, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200 font-medium"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
