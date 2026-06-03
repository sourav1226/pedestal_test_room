import { Router } from 'express';
import { getBatches, getBatchById, createBatch, updateBatch, deleteBatch, enrollStudent } from '../controllers/batch.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticate, getBatches);
router.get('/:id', authenticate, getBatchById);
router.post('/', authenticate, authorize(1, 2), createBatch);
router.put('/:id', authenticate, authorize(1, 2), updateBatch);
router.delete('/:id', authenticate, authorize(1), deleteBatch);
router.post('/:id/enroll', authenticate, authorize(1, 2, 3), enrollStudent);

export default router;
