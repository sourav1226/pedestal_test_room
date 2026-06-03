import { Router } from 'express';
import { startAttempt, submitAttempt, getAttempt, getStudentAttempts } from '../controllers/attempt.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.post('/start', authenticate, authorize(3), startAttempt);
router.post('/:id/submit', authenticate, submitAttempt);
router.get('/:id', authenticate, getAttempt);
router.get('/', authenticate, getStudentAttempts);

export default router;
