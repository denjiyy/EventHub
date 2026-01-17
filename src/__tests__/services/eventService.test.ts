import { EventService } from '../../services/eventService';
import { apiClient } from '../../services/api';

// Mock the API client
jest.mock('../../services/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('EventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvents', () => {
    it('should get all events without filters', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Test Event',
          description: 'Test description',
          category: { _id: 'cat1', name: 'Music' },
          date: '2025-01-01',
          location: 'Test Location',
          price: 50,
          capacity: 100,
          ticketsAvailable: 80,
        },
      ];

      mockApiClient.get.mockResolvedValue(mockEvents);

      const result = await EventService.getAllEvents();

      expect(mockApiClient.get).toHaveBeenCalledWith('/events');
      expect(result).toEqual(mockEvents);
    });

    it('should get events with category filter', async () => {
      const filters = { category: 'Music' };
      const mockEvents = [
        {
          _id: '1',
          title: 'Music Event',
          category: { _id: 'cat1', name: 'Music' },
        },
      ];

      mockApiClient.get.mockResolvedValue(mockEvents);

      const result = await EventService.getAllEvents(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/events?category=Music');
      expect(result).toEqual(mockEvents);
    });

    it('should get events with search filter', async () => {
      const filters = { search: 'concert' };
      const mockEvents = [
        {
          _id: '1',
          title: 'Rock Concert',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockEvents);

      const result = await EventService.getAllEvents(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/events?search=concert');
      expect(result).toEqual(mockEvents);
    });

    it('should get events with both category and search filters', async () => {
      const filters = { category: 'Music', search: 'rock' };
      const mockEvents = [
        {
          _id: '1',
          title: 'Rock Music Event',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockEvents);

      const result = await EventService.getAllEvents(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/events?category=Music&search=rock');
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should get event by ID', async () => {
      const eventId = 'event-123';
      const mockEvent = {
        _id: eventId,
        title: 'Test Event',
        description: 'Test description',
      };

      mockApiClient.get.mockResolvedValue(mockEvent);

      const result = await EventService.getEventById(eventId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/events/${eventId}`);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Event description',
        category: 'cat-123',
        date: '2025-02-01T10:00:00.000Z',
        location: 'Test Venue',
        price: 25,
        capacity: 50,
        ticketsAvailable: 50,
      };

      const mockResponse = {
        _id: 'new-event-id',
        ...eventData,
        organizer: { _id: 'org-123', firstName: 'John', lastName: 'Doe' },
        category: { _id: 'cat-123', name: 'Music' },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await EventService.createEvent(eventData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/events', eventData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const eventId = 'event-123';
      const updateData = {
        title: 'Updated Event Title',
        price: 30,
      };

      const mockResponse = {
        _id: eventId,
        title: 'Updated Event Title',
        price: 30,
      };

      mockApiClient.put.mockResolvedValue(mockResponse);

      const result = await EventService.updateEvent(eventId, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/events/${eventId}`, updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const eventId = 'event-123';

      mockApiClient.delete.mockResolvedValue(undefined);

      await EventService.deleteEvent(eventId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/events/${eventId}`);
    });
  });

  describe('getEventsByCategory', () => {
    it('should get events by category ID', async () => {
      const categoryId = 'cat-123';
      const mockEvents = [
        {
          _id: '1',
          title: 'Music Event 1',
          category: { _id: categoryId, name: 'Music' },
        },
        {
          _id: '2',
          title: 'Music Event 2',
          category: { _id: categoryId, name: 'Music' },
        },
      ];

      mockApiClient.get.mockResolvedValue(mockEvents);

      const result = await EventService.getEventsByCategory(categoryId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/events/category/${categoryId}`);
      expect(result).toEqual(mockEvents);
    });
  });
});