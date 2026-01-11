import { Request, Response } from 'express';
import { EventService } from '../services/eventService.js';

export class EventController {
  static async getAllEvents(req: Request, res: Response) {
    try {
      const { category, search } = req.query;
      const filters = {
        category: category as string,
        searchQuery: search as string,
      };

      const events = await EventService.getAllEvents(filters);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const eventData = { ...req.body, organizer: userId };
      const event = await EventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req.body);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getEventsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const events = await EventService.getEventsByCategory(categoryId);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
