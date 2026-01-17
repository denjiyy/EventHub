import Event, { IEvent } from '../models/Event.js';
import Category from '../models/Category.js';

export class EventService {
  static async getAllEvents(filters?: { category?: string; searchQuery?: string }) {
    try {
      let query = Event.find();

      if (filters?.category) {
        query = query.where('category').equals(filters.category);
      }

      if (filters?.searchQuery) {
        query = query.or([
          { title: new RegExp(filters.searchQuery, 'i') },
          { description: new RegExp(filters.searchQuery, 'i') },
        ]);
      }

      const events = await query.populate('category').populate('organizer', 'firstName lastName email');
      return events;
    } catch (error) {
      throw error;
    }
  }

  static async getEventById(eventId: string) {
    try {
      const event = await Event.findById(eventId)
        .populate('category')
        .populate('organizer', 'firstName lastName email')
        .populate('bookings');

      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  static async createEvent(eventData: Partial<IEvent>) {
    try {
      // Verify category exists
      const category = await Category.findById(eventData.category);
      if (!category) {
        throw new Error('Category not found');
      }

      const event = new Event(eventData);
      await event.save();
      
      // Populate the saved event
      const populatedEvent = await Event.findById(event._id)
        .populate('category')
        .populate('organizer', 'firstName lastName email');
      
      return populatedEvent;
    } catch (error) {
      throw error;
    }
  }

  static async updateEvent(eventId: string, updateData: Partial<IEvent>) {
    try {
      const event = await Event.findByIdAndUpdate(eventId, updateData, { new: true })
        .populate('category')
        .populate('organizer', 'firstName lastName email');

      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  static async deleteEvent(eventId: string) {
    try {
      const event = await Event.findByIdAndDelete(eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  static async getEventsByCategory(categoryId: string) {
    try {
      const events = await Event.find({ category: categoryId })
        .populate('category')
        .populate('organizer', 'firstName lastName email');
      return events;
    } catch (error) {
      throw error;
    }
  }
}
