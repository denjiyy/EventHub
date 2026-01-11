import { apiClient } from './api';

export interface CreateBookingDTO {
  eventId: string;
  numberOfTickets: number;
}

export interface BookingResponse {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    price: number;
  };
  numberOfTickets: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export class BookingService {
  static async createBooking(data: CreateBookingDTO): Promise<BookingResponse> {
    return apiClient.post('/bookings', data);
  }

  static async getBookingById(bookingId: string): Promise<BookingResponse> {
    return apiClient.get(`/bookings/${bookingId}`);
  }

  static async getUserBookings(): Promise<BookingResponse[]> {
    return apiClient.get('/bookings/user/my-bookings');
  }

  static async cancelBooking(bookingId: string): Promise<BookingResponse> {
    return apiClient.put(`/bookings/${bookingId}/cancel`);
  }

  static async getEventBookings(eventId: string): Promise<BookingResponse[]> {
    return apiClient.get(`/bookings/event/${eventId}`);
  }
}
