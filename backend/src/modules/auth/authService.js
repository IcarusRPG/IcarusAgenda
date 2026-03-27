import { findActiveUserByEmail } from '../../database/repositories/userRepository.js';
import { comparePassword } from '../../utils/password.js';
import { signAccessToken } from '../../utils/jwt.js';

export async function authenticateWithEmailAndPassword({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const plainPassword = String(password || '');

  if (!normalizedEmail || !plainPassword) {
    return null;
  }

  const user = await findActiveUserByEmail(normalizedEmail);

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword(plainPassword, user.password_hash);

  if (!isPasswordValid) {
    return null;
  }

  const token = signAccessToken({
    userId: user.id,
    companyId: user.company_id,
    role: user.role,
  });

  return {
    user_id: user.id,
    company_id: user.company_id,
    name: user.name,
    role: user.role,
    token,
    company: {
      id: user.company_id,
      name: user.company_name,
      slug: user.company_slug,
      logoUrl: user.company_logo_url,
      status: user.company_status,
      timezone: user.company_timezone,
    },
  };
}
