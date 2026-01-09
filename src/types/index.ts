export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  category: string;
  price: number;
  capacity: number;
  availableTickets: number;
  image: string;
  organizer: string;
  featured?: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  userName: string;
  userEmail: string;
  ticketCount: number;
  totalPrice: number;
  bookedAt: string;
}

export interface BookingFormData {
  userName: string;
  userEmail: string;
  ticketCount: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type Route = 
  | { page: 'home' }
  | { page: 'events' }
  | { page: 'event-detail'; id: string }
  | { page: 'bookings' }
  | { page: 'create' };
