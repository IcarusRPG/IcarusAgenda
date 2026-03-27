import { Router } from 'express';
import { getCurrentCompany, getPublicCompanyProfile } from '../controllers/companyController.js';

const router = Router();

router.get('/:companySlug/public-profile', getPublicCompanyProfile);
router.get('/current', getCurrentCompany);

export { router as companyRoutes };
