import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UniqueConstraintError } from 'sequelize';
import { Request, Response } from 'express';
import User from '../models/User';
import { findUserByEmail, normalizeEmail } from '../utils/userLookup';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password_hash,
      role: 'user'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const generateRefreshToken = (userId: string) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET?.trim();
  if (!refreshSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not set');
  }

  return jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: '7d' }
  );
};

const generateAccessToken = (userId: string, role: 'user' | 'admin') => {
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: '1h' });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordHash = user.getDataValue('password_hash');

    if (!passwordHash) {
      return res.status(500).json({ error: 'Stored password hash is missing' });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await user.update({ refresh_token: refreshToken });

    return res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET?.trim();

    if (!refreshSecret) {
      return res.status(500).json({ error: 'REFRESH_TOKEN_SECRET is not set' });
    }

    const payload = jwt.verify(refreshToken, refreshSecret) as { userId?: string };

    if (!payload.userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findByPk(payload.userId);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token revoked or expired' });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const user = await User.findByPk(req.user.userId);

    if (user) {
      await user.update({ refresh_token: null });
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    const user = email ? await findUserByEmail(email) : null;

    if (!user) {
      return res.json({ message: 'If the account exists, a reset link has been sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({
      reset_token: token,
      reset_token_expires_at: resetTokenExpiresAt
    });

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/$/, '');
    console.log(`[password-reset] ${user.email}: ${frontendUrl}/reset-password?token=${token}`);

    return res.json({ message: 'If the account exists, a reset link has been sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body as { token?: string; newPassword?: string };

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ where: { reset_token: token } });

    if (!user || !user.reset_token_expires_at || user.reset_token_expires_at.getTime() < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await user.update({
      password_hash,
      reset_token: null,
      reset_token_expires_at: null
    });

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
