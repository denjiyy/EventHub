import React from 'react';
import { Calendar, Ticket, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useRouter } from '../context/Router';
import { useApp } from '../context/AppContext';

export function BookingsPage() {
  const { navigate } = useRouter();
  const { bookings } = useApp();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage your event tickets and reservations</p>
        </div>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full mb-6">
              <Ticket className="w-10 h-10 text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No bookings yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start exploring amazing events and book your first ticket!</p>
            <button
              onClick={() => navigate({ page: 'events' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-200">
                          Confirmed
                        </div>
                        <div className="text-sm text-gray-500">
                          Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{booking.eventTitle}</h3>
                      <p className="text-gray-600">Booking ID: {booking.id}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate({ page: 'event-detail', id: booking.eventId })}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      View Event
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">Date</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">Time</div>
                        <div className="font-semibold text-gray-900">{booking.eventTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">Location</div>
                        <div className="font-semibold text-gray-900 truncate">{booking.eventLocation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Ticket className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">Tickets</div>
                        <div className="font-semibold text-gray-900">{booking.ticketCount} ticket(s)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Paid</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        ${booking.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
