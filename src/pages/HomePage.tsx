import React, { useState } from 'react';
import { Search, Star, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EventCard } from '../components/EventCard';

export function HomePage() {
  const { events, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const regularEvents = filteredEvents.filter(e => !e.featured);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-violet-600/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 100,000+ event-goers</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Amazing
            <span className="block bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
              Events Near You
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-violet-100 mb-10 max-w-3xl mx-auto">
            From concerts to conferences, find and book tickets for the best events happening in your city
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for events, artists, or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-900 bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all text-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-amber-500 fill-current" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
            </div>
            
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {regularEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">All Events</h2>
            
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search to find what you're looking for</p>
          </div>
        )}
      </div>
    </div>
  );
}
