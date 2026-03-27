import { Router } from 'express';
import { healthController } from '../modules/health/healthController.js';

const router = Router();

router.get('/', healthController);

export { router as healthRoutes };
