import { Router } from 'express';
import { getResults, getResultById, getQuizResults } from '../controllers/result.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getResults);
router.get('/quiz/:quizId', authenticate, getQuizResults);
router.get('/:id', authenticate, getResultById);

export default router;
