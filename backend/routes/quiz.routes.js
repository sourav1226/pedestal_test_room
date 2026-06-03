import { Router } from 'express';
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticate, getQuizzes);
router.get('/:id', authenticate, getQuizById);
router.post('/', authenticate, authorize(1, 2), createQuiz);
router.put('/:id', authenticate, authorize(1, 2), updateQuiz);
router.delete('/:id', authenticate, authorize(1, 2), deleteQuiz);

export default router;
