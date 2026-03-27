import { TENANT_HEADER } from '../config/constants.js';

export function tenantContext(req, _res, next) {
  const companyId = req.header(TENANT_HEADER) || null;

  req.tenant = {
    companyId,
  };

  next();
}
