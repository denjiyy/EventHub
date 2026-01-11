import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, X, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/Router';
import { useApp } from '../context/AppContext';
import { EventService, EventResponse } from '../services/eventService';
import { CategoryBadge } from '../components/CategoryBadge';

interface EventDetailPageProps {
  eventId: string;
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const { navigate } = useRouter();
  const { createBooking, isAuthenticated } = useApp();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const eventData = await EventService.getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);
  const [ticketCount, setTicketCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please log in to book tickets');
      return;
    }

    if (ticketCount < 1 || !event || ticketCount > event.ticketsAvailable) {
      alert('Invalid ticket count');
      return;
    }

    try {
      setSubmitting(true);
      await createBooking(eventId, ticketCount);
      navigate({ page: 'bookings' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist</p>
          <button
            onClick={() => navigate({ page: 'events' })}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const ticketPercentage = ((event.capacity - event.ticketsAvailable) / event.capacity) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate({ page: 'events' })}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-96">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                  <CategoryBadge category={event.category?.name || 'Event'} />
                </div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white text-5xl font-bold mb-2">
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </div>
                  <div className="text-violet-200">per ticket</div>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Date</div>
                      <div className="text-lg font-bold text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Time</div>
                      <div className="text-lg font-bold text-gray-900">
                        {new Date(event.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Location</div>
                      <div className="text-lg font-bold text-gray-900">{event.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Availability</div>
                      <div className="text-lg font-bold text-gray-900">
                        {event.ticketsAvailable} / {event.capacity} tickets
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${ticketPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Organized by</div>
                  <div className="text-lg font-bold text-gray-900">{event.organizer.firstName} {event.organizer.lastName}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(event.ticketsAvailable, 10)}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {event.ticketsAvailable} tickets available
                  </p>
                </div>
                
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 font-medium">Total Price</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      ${(event.price * ticketCount).toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || event.ticketsAvailable === 0}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : !isAuthenticated ? (
                      'Log In to Book'
                    ) : event.ticketsAvailable === 0 ? (
                      'Sold Out'
                    ) : (
                      'Complete Booking'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout • Instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
