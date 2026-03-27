import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const authHeader = req.header('authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Token Bearer ausente ou inválido.',
    });
  }

  try {
    const payload = verifyAccessToken(token);

    req.auth = {
      userId: payload.userId,
      companyId: payload.companyId,
      role: payload.role,
      token,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: 'Token inválido ou expirado.',
    });
  }
}
