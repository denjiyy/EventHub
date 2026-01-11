import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, BookingController.createBooking);
router.get('/:id', BookingController.getBookingById);
router.get('/user/my-bookings', authenticate, BookingController.getUserBookings);
router.put('/:id/cancel', authenticate, BookingController.cancelBooking);
router.get('/event/:eventId', BookingController.getEventBookings);

export default router;
