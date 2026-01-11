import { Router } from 'express';
import { EventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/', authenticate, EventController.createEvent);
router.put('/:id', authenticate, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);
router.get('/category/:categoryId', EventController.getEventsByCategory);

export default router;
