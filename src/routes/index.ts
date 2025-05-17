import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import metricRoutes from './metric.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/metrics', metricRoutes);

export default router; 