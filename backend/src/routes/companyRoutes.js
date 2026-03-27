import { Router } from 'express';
import {
  createCompanyController,
  getCompanyByIdController,
  getCompanyBySlugController,
  getCurrentCompany,
  getPublicCompanyProfile,
  listCompaniesController,
  updateCompanyController,
} from '../controllers/companyController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { tenantContext } from '../middlewares/tenantContext.js';

const router = Router();

router.get('/slug/:slug', getCompanyBySlugController);
router.get('/:companySlug/public-profile', getPublicCompanyProfile);

router.use(requireAuth, tenantContext);

router.get('/', listCompaniesController);
router.post('/', createCompanyController);
router.get('/current', getCurrentCompany);
router.get('/:id', getCompanyByIdController);
router.patch('/:id', updateCompanyController);

export { router as companyRoutes };
