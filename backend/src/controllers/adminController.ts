import { Request, Response } from 'express';
import User from '../models/User';
import { normalizeEmail } from '../utils/userLookup';

export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ role: 'admin' });

    return res.json({
      message: 'User promoted to admin',
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
