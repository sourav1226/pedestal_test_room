import { Router } from 'express';
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, bulkImport } from '../controllers/question.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/quiz/:quizId', authenticate, getQuestions);
router.get('/:id', authenticate, getQuestionById);
router.post('/', authenticate, authorize(1, 2), createQuestion);
router.post('/bulk', authenticate, authorize(1, 2), bulkImport);
router.put('/:id', authenticate, authorize(1, 2), updateQuestion);
router.delete('/:id', authenticate, authorize(1, 2), deleteQuestion);

export default router;
