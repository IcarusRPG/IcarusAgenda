import { Router } from 'express';
import { getCurrentCompany, getPublicCompanyProfile } from '../controllers/companyController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { tenantContext } from '../middlewares/tenantContext.js';

const router = Router();

router.get('/:companySlug/public-profile', getPublicCompanyProfile);
router.get('/current', requireAuth, tenantContext, getCurrentCompany);

export { router as companyRoutes };
