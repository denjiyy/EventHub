import React, { useState, useCallback } from 'react';
import { Booking, BookingFormData, Toast } from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';

interface AppContextType {
  events: typeof MOCK_EVENTS;
  bookings: Booking[];
  loading: boolean;
  toasts: Toast[];
  fetchEvents: (filters?: { date?: string; location?: string; category?: string }) => Promise<typeof MOCK_EVENTS>;
  createBooking: (eventId: string, formData: BookingFormData) => Promise<Booking>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export function useAppData() {
  const [events, setEvents] = useState([...MOCK_EVENTS]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 4000);
  }, []);

  const fetchEvents = useCallback(async (filters?: { date?: string; location?: string; category?: string }) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filtered = [...MOCK_EVENTS];
    
    if (filters?.date) {
      filtered = filtered.filter(e => e.date === filters.date);
    }
    if (filters?.location) {
      filtered = filtered.filter(e => 
        e.city.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    
    setEvents(filtered);
    setLoading(false);
    return filtered;
  }, []);

  const createBooking = useCallback(async (eventId: string, formData: BookingFormData): Promise<Booking> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) {
      setLoading(false);
      throw new Error('Event not found');
    }
    
    if (event.availableTickets < formData.ticketCount) {
      setLoading(false);
      throw new Error('Not enough tickets available');
    }
    
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      userName: formData.userName,
      userEmail: formData.userEmail,
      ticketCount: formData.ticketCount,
      totalPrice: event.price * formData.ticketCount,
      bookedAt: new Date().toISOString()
    };
    
    setBookings((prev: Booking[]) => [...prev, booking]);
    event.availableTickets -= formData.ticketCount;
    setEvents((prev) => prev.map(e => e.id === eventId ? {...e, availableTickets: event.availableTickets} : e));
    
    setLoading(false);
    addToast('Booking confirmed! Check your email for details.', 'success');
    return booking;
  }, [addToast]);

  return { events, bookings, loading, fetchEvents, createBooking, toasts, addToast };
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
