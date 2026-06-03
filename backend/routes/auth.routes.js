import { Router } from 'express';
import { login, register, refreshToken, logout, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
