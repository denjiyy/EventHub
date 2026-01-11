import React, { useState, useCallback, useEffect } from 'react';
import { Booking, BookingFormData, Toast } from '../types';
import { EventService, EventResponse } from '../services/eventService';
import { BookingService, BookingResponse } from '../services/bookingService';
import { AuthService } from '../services/authService';
import { SeedService } from '../services/seedService';

interface AppContextType {
  events: EventResponse[];
  bookings: BookingResponse[];
  loading: boolean;
  toasts: Toast[];
  isAuthenticated: boolean;
  currentUser: any;
  fetchEvents: (filters?: { date?: string; location?: string; category?: string }) => Promise<EventResponse[]>;
  createBooking: (eventId: string, numberOfTickets: number) => Promise<BookingResponse>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  fetchUserBookings: () => Promise<void>;
  seedDatabase: () => Promise<void>;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export function useAppData() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const profile = await AuthService.getProfile();
      setCurrentUser(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsAuthenticated(false);
    }
  };

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 4000);
  }, []);

  const fetchEvents = useCallback(
    async (filters?: { date?: string; location?: string; category?: string }) => {
      try {
        setLoading(true);
        const fetchedEvents = await EventService.getAllEvents({
          category: filters?.category,
          search: filters?.location,
        });

        let filtered = fetchedEvents;

        if (filters?.date) {
          filtered = filtered.filter((e) => {
            const eventDate = new Date(e.date).toISOString().split('T')[0];
            return eventDate === filters.date;
          });
        }

        setEvents(filtered);
        setLoading(false);
        return filtered;
      } catch (error: any) {
        setLoading(false);
        addToast(error.message || 'Error fetching events', 'error');
        return [];
      }
    },
    [addToast]
  );

  const createBooking = useCallback(
    async (eventId: string, numberOfTickets: number): Promise<BookingResponse> => {
      try {
        setLoading(true);
        const booking = await BookingService.createBooking({
          eventId,
          numberOfTickets,
        });

        setBookings((prev) => [...prev, booking]);
        setLoading(false);
        addToast('Booking confirmed!', 'success');

        await fetchEvents();

        return booking;
      } catch (error: any) {
        setLoading(false);
        addToast(error.message || 'Error creating booking', 'error');
        throw error;
      }
    },
    [addToast, fetchEvents]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const result = await AuthService.login(email, password);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setLoading(false);
        addToast('Login successful!', 'success');
        await fetchUserBookings();
      } catch (error: any) {
        setLoading(false);
        addToast(error.message || 'Login failed', 'error');
        throw error;
      }
    },
    [addToast]
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        setLoading(true);
        const result = await AuthService.register(email, password, firstName, lastName);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setLoading(false);
        addToast('Registration successful!', 'success');
      } catch (error: any) {
        setLoading(false);
        addToast(error.message || 'Registration failed', 'error');
        throw error;
      }
    },
    [addToast]
  );

  const logout = useCallback(() => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setBookings([]);
    addToast('Logged out successfully', 'success');
  }, [addToast]);

  const fetchUserBookings = useCallback(async () => {
    try {
      if (!isAuthenticated) return;
      const userBookings = await BookingService.getUserBookings();
      setBookings(userBookings);
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
    }
  }, [isAuthenticated]);

  const seedDatabase = useCallback(async () => {
    try {
      setLoading(true);
      await SeedService.seedDatabase();
      setLoading(false);
      addToast('Database seeded successfully!', 'success');
      await fetchEvents();
    } catch (error: any) {
      setLoading(false);
      addToast(error.message || 'Error seeding database', 'error');
      throw error;
    }
  }, [addToast, fetchEvents]);

  return {
    events,
    bookings,
    loading,
    fetchEvents,
    createBooking,
    toasts,
    addToast,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    fetchUserBookings,
    seedDatabase,
  };
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
