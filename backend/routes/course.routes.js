import { Router } from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourseById);
router.post('/', authenticate, authorize(1, 2), createCourse);
router.put('/:id', authenticate, authorize(1, 2), updateCourse);
router.delete('/:id', authenticate, authorize(1), deleteCourse);

export default router;
