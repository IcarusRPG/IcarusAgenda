import { ICARUS_BRAND } from '../config/constants.js';
import {
  createCompanyRecord,
  getCompanyById,
  getCompanyBySlug,
  getCompanyPublicProfileBySlug,
  listCompaniesForTenant,
  updateCompanyRecord,
} from '../modules/companies/companyService.js';

function isDbNotConfigured(error) {
  return error.message.includes('DATABASE_URL não configurada');
}

function canManageCompany(role) {
  return role === 'owner' || role === 'admin';
}

function assertTenantAccess(req, companyId) {
  if (!req.tenant?.companyId || req.tenant.companyId !== companyId) {
    const error = new Error('Acesso negado para empresa informada.');
    error.status = 403;
    throw error;
  }
}

export async function getPublicCompanyProfile(req, res, next) {
  try {
    const { companySlug } = req.params;
    const profile = await getCompanyPublicProfileBySlug(companySlug);

    if (!profile) {
      return res.status(404).json({
        message: 'Empresa não encontrada para o slug informado.',
      });
    }

    return res.json({
      ...profile,
      bookingEnabled: true,
      footerBrand: {
        name: ICARUS_BRAND.name,
        logoUrl: ICARUS_BRAND.defaultLogoUrl,
      },
    });
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function listCompaniesController(req, res, next) {
  try {
    const companies = await listCompaniesForTenant(req.tenant.companyId);
    return res.json({ items: companies });
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function createCompanyController(req, res, next) {
  try {
    if (!canManageCompany(req.tenant.role)) {
      return res.status(403).json({
        message: 'Somente admin/owner podem criar empresas.',
      });
    }

    const company = await createCompanyRecord(req.body);
    return res.status(201).json(company);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function getCompanyByIdController(req, res, next) {
  try {
    const { id } = req.params;
    assertTenantAccess(req, id);

    const company = await getCompanyById(id);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada.',
      });
    }

    return res.json(company);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function getCompanyBySlugController(req, res, next) {
  try {
    const { slug } = req.params;
    const company = await getCompanyBySlug(slug);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada para o slug informado.',
      });
    }

    return res.json(company);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function updateCompanyController(req, res, next) {
  try {
    const { id } = req.params;
    assertTenantAccess(req, id);

    if (!canManageCompany(req.tenant.role)) {
      return res.status(403).json({
        message: 'Somente admin/owner podem editar empresa.',
      });
    }

    const updated = await updateCompanyRecord(id, req.body);

    if (!updated) {
      return res.status(404).json({
        message: 'Empresa não encontrada para atualização.',
      });
    }

    return res.json(updated);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}

export async function getCurrentCompany(req, res, next) {
  try {
    if (!req.tenant?.companyId) {
      return res.status(400).json({
        message: 'Token de autenticação inválido para contexto de tenant.',
      });
    }

    const company = await getCompanyById(req.tenant.companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada para o tenant informado.',
      });
    }

    return res.json(company);
  } catch (error) {
    if (isDbNotConfigured(error)) {
      return res.status(503).json({
        message: 'Banco de dados não configurado. Defina DATABASE_URL para habilitar este endpoint.',
      });
    }

    return next(error);
  }
}
