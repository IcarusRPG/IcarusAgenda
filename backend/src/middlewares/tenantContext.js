export function tenantContext(req, _res, next) {
  req.tenant = {
    companyId: req.auth?.companyId || null,
    userId: req.auth?.userId || null,
    role: req.auth?.role || null,
  };

  next();
}
