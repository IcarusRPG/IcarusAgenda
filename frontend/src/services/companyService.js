import { httpClient } from './httpClient';

export async function listCompanies() {
  return httpClient('/companies');
}

export async function getCompanyById(companyId) {
  return httpClient(`/companies/${companyId}`);
}

export async function getCompanyBySlug(slug) {
  return httpClient(`/companies/slug/${slug}`);
}

export async function createCompany(payload) {
  return httpClient('/companies', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCompany(companyId, payload) {
  return httpClient(`/companies/${companyId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
