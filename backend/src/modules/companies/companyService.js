import {
  createCompany,
  findCompanyById,
  findCompanyBySlug,
  listCompaniesByTenant,
  updateCompanyById,
} from '../../database/repositories/companyRepository.js';

const COMPANY_STATUS = new Set(['active', 'inactive', 'suspended']);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeSlug(slug) {
  return String(slug || '')
    .trim()
    .toLowerCase();
}

function buildValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function buildConflictError(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function validateCompanyPayload(payload, { partial = false } = {}) {
  const name = payload.name === undefined ? undefined : String(payload.name).trim();
  const slug = payload.slug === undefined ? undefined : normalizeSlug(payload.slug);
  const timezone = payload.timezone === undefined ? undefined : String(payload.timezone).trim();
  const status = payload.status === undefined ? undefined : String(payload.status).trim().toLowerCase();
  const logoUrl = payload.logo_url === undefined ? payload.logoUrl : payload.logo_url;

  if (!partial || name !== undefined) {
    if (!name) {
      throw buildValidationError('Campo name é obrigatório.');
    }
  }

  if (!partial || slug !== undefined) {
    if (!slug) {
      throw buildValidationError('Campo slug é obrigatório.');
    }

    if (!SLUG_REGEX.test(slug)) {
      throw buildValidationError('Slug inválido. Use apenas letras minúsculas, números e hífens.');
    }
  }

  if (!partial || timezone !== undefined) {
    if (!timezone) {
      throw buildValidationError('Campo timezone é obrigatório.');
    }
  }

  if (status !== undefined && !COMPANY_STATUS.has(status)) {
    throw buildValidationError('Status inválido. Use active, inactive ou suspended.');
  }

  return {
    name,
    slug,
    timezone,
    status,
    logoUrl: logoUrl === undefined ? undefined : String(logoUrl || '').trim(),
  };
}

async function ensureSlugUnique(slug, currentCompanyId) {
  if (!slug) {
    return;
  }

  const companyWithSlug = await findCompanyBySlug(slug);

  if (companyWithSlug && companyWithSlug.id !== currentCompanyId) {
    throw buildConflictError('Slug já está em uso por outra empresa.');
  }
}

export async function getCompanyPublicProfileBySlug(companySlug) {
  const company = await findCompanyBySlug(normalizeSlug(companySlug));

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

export async function getCompanyBySlug(companySlug) {
  return findCompanyBySlug(normalizeSlug(companySlug));
}

export async function listCompaniesForTenant(tenantCompanyId) {
  return listCompaniesByTenant(tenantCompanyId);
}

export async function createCompanyRecord(payload) {
  const validPayload = validateCompanyPayload(payload);
  await ensureSlugUnique(validPayload.slug);

  const data = {
    name: validPayload.name,
    slug: validPayload.slug,
    timezone: validPayload.timezone,
    status: validPayload.status || 'active',
    logoUrl: validPayload.logoUrl || null,
  };

  return createCompany(data);
}

export async function updateCompanyRecord(companyId, payload) {
  const validPayload = validateCompanyPayload(payload, { partial: true });

  if (
    validPayload.name === undefined &&
    validPayload.slug === undefined &&
    validPayload.timezone === undefined &&
    validPayload.status === undefined &&
    validPayload.logoUrl === undefined
  ) {
    throw buildValidationError('Informe ao menos um campo para atualização.');
  }

  await ensureSlugUnique(validPayload.slug, companyId);

  return updateCompanyById(companyId, {
    name: validPayload.name,
    slug: validPayload.slug,
    timezone: validPayload.timezone,
    status: validPayload.status,
    logoUrl: validPayload.logoUrl,
  });
}
