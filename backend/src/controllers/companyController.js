import { ICARUS_BRAND } from '../config/constants.js';

export function getPublicCompanyProfile(req, res) {
  const { companySlug } = req.params;

  res.json({
    slug: companySlug,
    companyName: 'Empresa Exemplo',
    logoUrl: 'https://dummyimage.com/180x60/0f172a/ffffff&text=Empresa',
    bookingEnabled: true,
    footerBrand: {
      name: ICARUS_BRAND.name,
      logoUrl: ICARUS_BRAND.defaultLogoUrl,
    },
  });
}

export function getCurrentCompany(req, res) {
  if (!req.tenant?.companyId) {
    return res.status(400).json({
      message: 'Header x-company-id é obrigatório para contexto de tenant.',
    });
  }

  return res.json({
    id: req.tenant.companyId,
    name: 'Empresa do Tenant',
    slug: 'empresa-do-tenant',
  });
}
