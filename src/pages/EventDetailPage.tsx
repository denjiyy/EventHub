import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, X, ArrowLeft, Star } from 'lucide-react';
import { BookingFormData } from '../types';
import { useRouter } from '../context/Router';
import { useApp } from '../context/AppContext';
import { MOCK_EVENTS } from '../data/mockEvents';
import { CategoryBadge } from '../components/CategoryBadge';

interface EventDetailPageProps {
  eventId: string;
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const { navigate } = useRouter();
  const { createBooking } = useApp();
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  
  const [formData, setFormData] = useState<BookingFormData>({
    userName: '',
    userEmail: '',
    ticketCount: 1
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BookingFormData, string>> = {};
    
    if (!formData.userName.trim()) {
      errors.userName = 'Name is required';
    } else if (formData.userName.trim().length < 2) {
      errors.userName = 'Name must be at least 2 characters';
    }
    
    if (!formData.userEmail.trim()) {
      errors.userEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      errors.userEmail = 'Please enter a valid email';
    }
    
    if (formData.ticketCount < 1) {
      errors.ticketCount = 'At least 1 ticket required';
    } else if (event && formData.ticketCount > event.availableTickets) {
      errors.ticketCount = `Only ${event.availableTickets} tickets available`;
    } else if (formData.ticketCount > 10) {
      errors.ticketCount = 'Maximum 10 tickets per booking';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || !eventId) return;
    
    try {
      setSubmitting(true);
      await createBooking(eventId, formData);
      navigate({ page: 'bookings' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };
  
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

  const ticketPercentage = ((event.capacity - event.availableTickets) / event.capacity) * 100;
  
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
                  <CategoryBadge category={event.category} />
                  {event.featured && (
                    <div className="flex items-center gap-1 bg-amber-400 text-amber-900 px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
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
                      <div className="text-lg font-bold text-gray-900">{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Location</div>
                      <div className="text-lg font-bold text-gray-900">{event.location}</div>
                      <div className="text-sm text-gray-600">{event.city}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">Availability</div>
                      <div className="text-lg font-bold text-gray-900">
                        {event.availableTickets} / {event.capacity} tickets
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
                  <div className="text-lg font-bold text-gray-900">{event.organizer}</div>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.userName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-violet-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.userName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {formErrors.userName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.userEmail 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-violet-500'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.userEmail && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {formErrors.userEmail}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(event.availableTickets, 10)}
                    value={formData.ticketCount}
                    onChange={(e) => setFormData({ ...formData, ticketCount: parseInt(e.target.value) || 1 })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.ticketCount 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-violet-500'
                    }`}
                  />
                  {formErrors.ticketCount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {formErrors.ticketCount}
                    </p>
                  )}
                </div>
                
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 font-medium">Total Price</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      ${(event.price * formData.ticketCount).toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || event.availableTickets === 0}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : event.availableTickets === 0 ? (
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
