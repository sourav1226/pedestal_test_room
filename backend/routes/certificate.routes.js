import { Router } from 'express';
import { getCertificates, getCertificateById, getMyCertificates } from '../controllers/certificate.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getCertificates);
router.get('/mine', authenticate, getMyCertificates);
router.get('/:id', authenticate, getCertificateById);

export default router;
