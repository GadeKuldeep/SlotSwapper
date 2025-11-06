import express from 'express';
import {
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/my')
  .get(getMyEvents);

router
  .route('/')
  .post(createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

export default router;