import { apiClient } from './api';

export interface CreateEventDTO {
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  ticketsAvailable: number;
  image?: string;
}

export interface EventResponse {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  date: string;
  location: string;
  price: number;
  capacity: number;
  ticketsAvailable: number;
  image?: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bookings: string[];
  createdAt: string;
  updatedAt: string;
}

export class EventService {
  static async getAllEvents(filters?: { category?: string; search?: string }): Promise<EventResponse[]> {
    let endpoint = '/events';
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    return apiClient.get(endpoint);
  }

  static async getEventById(eventId: string): Promise<EventResponse> {
    return apiClient.get(`/events/${eventId}`);
  }

  static async createEvent(data: CreateEventDTO): Promise<EventResponse> {
    return apiClient.post('/events', data);
  }

  static async updateEvent(eventId: string, data: Partial<CreateEventDTO>): Promise<EventResponse> {
    return apiClient.put(`/events/${eventId}`, data);
  }

  static async deleteEvent(eventId: string): Promise<void> {
    return apiClient.delete(`/events/${eventId}`);
  }

  static async getEventsByCategory(categoryId: string): Promise<EventResponse[]> {
    return apiClient.get(`/events/category/${categoryId}`);
  }
}
