import { Router } from 'express';
import {
  createPublicAppointmentController,
  getPublicAvailabilityController,
  getPublicCompanyController,
  getPublicServicesController,
} from '../controllers/publicBookingController.js';

const router = Router();

router.get('/companies/:slug', getPublicCompanyController);
router.get('/companies/:slug/services', getPublicServicesController);
router.get('/companies/:slug/availability', getPublicAvailabilityController);
router.post('/appointments', createPublicAppointmentController);

export { router as publicRoutes };
