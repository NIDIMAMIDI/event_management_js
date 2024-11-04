import { Router } from 'express';
import { authorization } from '../../middlewares/authorization/authorization.middlewares.js';
import {
  allEvents,
  cancelEventRegister,
  createEvent,
  deleteEvent,
  eventRegister,
  getEvent,
  updateEvent
} from '../../controllers/events/events.controllers.js';
import { eventValidation } from '../../utils/validations/events.create.validation.js';
const eventRouter = Router();

eventRouter.use(authorization);

eventRouter.post('/create', eventValidation, createEvent);
eventRouter.get('/all', allEvents);
eventRouter.get('/:id', getEvent);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);
eventRouter.post('/:id/register', eventRegister);
eventRouter.delete('/:id/register', cancelEventRegister);

export default eventRouter;
