import { authenticateWithEmailAndPassword } from '../modules/auth/authService.js';

function isInfraConfigError(error) {
  return (
    error.message.includes('DATABASE_URL não configurada') ||
    error.message.includes('JWT_SECRET não configurado')
  );
}

export async function loginController(req, res, next) {
  try {
    const authResult = await authenticateWithEmailAndPassword(req.body);

    if (!authResult) {
      return res.status(401).json({
        message: 'Credenciais inválidas.',
      });
    }

    return res.json(authResult);
  } catch (error) {
    if (isInfraConfigError(error)) {
      return res.status(503).json({
        message: error.message,
      });
    }

    return next(error);
  }
}
