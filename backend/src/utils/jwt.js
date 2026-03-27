import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

function ensureJwtConfig() {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET não configurado. Defina JWT_SECRET no .env.');
  }
}

export function signAccessToken(payload) {
  ensureJwtConfig();

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function verifyAccessToken(token) {
  ensureJwtConfig();

  return jwt.verify(token, env.jwtSecret);
}
