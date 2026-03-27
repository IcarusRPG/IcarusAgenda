import { Router } from 'express';
import {
  listAppointmentsController,
  updateAppointmentController,
  updateAppointmentStatusController,
} from '../controllers/appointmentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { tenantContext } from '../middlewares/tenantContext.js';

const router = Router();

router.use(requireAuth, tenantContext);

router.get('/', listAppointmentsController);
router.patch('/:id/status', updateAppointmentStatusController);
router.patch('/:id', updateAppointmentController);

export { router as appointmentRoutes };
