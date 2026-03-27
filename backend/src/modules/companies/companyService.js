import { findCompanyById, findCompanyBySlug } from '../../database/repositories/companyRepository.js';

export async function getCompanyPublicProfileBySlug(companySlug) {
  const company = await findCompanyBySlug(companySlug);

  if (!company) {
    return null;
  }

  return {
    slug: company.slug,
    companyName: company.name,
    logoUrl: company.logo_url,
    status: company.status,
    timezone: company.timezone,
  };
}

export async function getCompanyById(companyId) {
  return findCompanyById(companyId);
}
