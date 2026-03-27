import { Router } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { authRoutes } from './authRoutes.js';
import { companyRoutes } from './companyRoutes.js';
import { publicRoutes } from './publicRoutes.js';
import { appointmentRoutes } from './appointmentRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/companies', companyRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/public', publicRoutes);

export { apiRouter };
