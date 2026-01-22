import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EventCard } from '../components/EventCard';

export function EventsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Use React Query hook with filters
  const eventsQuery = useEvents(
    filters.search || filters.category ? filters : undefined
  );
  const events = eventsQuery.data || [];
  const isLoading = eventsQuery.isLoading;
  
  const categories = ['Music', 'Technology', 'Art', 'Food', 'Sports', 'Comedy'];
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ search: '', category: '' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">All Events</h1>
            <p className="text-lg text-gray-600">Discover your next amazing experience</p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-gray-700 border border-gray-200"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Filter Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Events</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-violet-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}