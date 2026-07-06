import { Router } from 'express';
import { forgotPassword, register, resetPassword } from '../controllers/authController';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
