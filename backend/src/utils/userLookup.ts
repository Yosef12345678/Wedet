import User from '../models/User';

export const normalizeEmail = (email: string | undefined | null) => {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
};

export const findUserByEmail = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({ where: { email: normalizedEmail } });
};
