import Booking, { IBooking } from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

export class BookingService {
  static async createBooking(userId: string, eventId: string, numberOfTickets: number) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.ticketsAvailable < numberOfTickets) {
        throw new Error('Not enough tickets available');
      }

      const totalPrice = event.price * numberOfTickets;

      const booking = new Booking({
        user: userId,
        event: eventId,
        numberOfTickets,
        totalPrice,
        status: 'confirmed',
      });

      await booking.save();

      event.ticketsAvailable -= numberOfTickets;
      event.bookings.push(booking._id);
      await event.save();

      const user = await User.findById(userId);
      if (user) {
        user.bookings.push(booking._id);
        await user.save();
      }

      await booking.populate(['event', 'user']);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  static async getBookingById(bookingId: string) {
    try {
      const booking = await Booking.findById(bookingId).populate('event').populate('user');
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (error) {
      throw error;
    }
  }

  static async getUserBookings(userId: string) {
    try {
      const bookings = await Booking.find({ user: userId }).populate('event').populate('user');
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  static async cancelBooking(bookingId: string) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update booking status
      booking.status = 'cancelled';
      await booking.save();

      // Restore event tickets
      const event = await Event.findById(booking.event);
      if (event) {
        event.ticketsAvailable += booking.numberOfTickets;
        event.bookings = event.bookings.filter((b) => b.toString() !== bookingId);
        await event.save();
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  static async getEventBookings(eventId: string) {
    try {
      const bookings = await Booking.find({ event: eventId }).populate('user');
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}
