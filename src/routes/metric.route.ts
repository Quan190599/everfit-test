import express from 'express';
import { createMetric, getMetrics, getChartData } from '../controllers';
import { CreateMetricDto, GetMetricsQueryDto, GetChartDataQueryDto } from '../dto';
import { validateRequest, protectOrNoUser } from '../middleware';

const router = express.Router();
router.use(protectOrNoUser);

router.post(
  '/',
  validateRequest({ body: CreateMetricDto }),
  createMetric
);

router.get(
  '/',
  validateRequest({ query: GetMetricsQueryDto }),
  getMetrics
);

router.get(
  '/charts',
  validateRequest({ query: GetChartDataQueryDto }),
  getChartData
);

export default router; 