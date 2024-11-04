import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import eventRouter from './events/events.routes.js';
const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/events', eventRouter);

export default indexRouter;
