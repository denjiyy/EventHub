import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService.js';

export class BookingController {
  static async createBooking(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { eventId, numberOfTickets } = req.body;

      if (!eventId || !numberOfTickets) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const booking = await BookingService.createBooking(userId, eventId, numberOfTickets);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserBookings(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const bookings = await BookingService.getUserBookings(userId);
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await BookingService.cancelBooking(id);
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getEventBookings(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const bookings = await BookingService.getEventBookings(eventId);
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
