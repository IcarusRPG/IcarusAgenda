import { ICARUS_BRAND } from '../config/constants.js';
import { getCompanyById, getCompanyPublicProfileBySlug } from '../modules/companies/companyService.js';

function isDbNotConfigured(error) {
  return error.message.includes('DATABASE_URL não configurada');
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
