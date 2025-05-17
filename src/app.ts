import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import metricRoutes from './routes/metric.route';
import { errorHandler } from './middleware/error-handler.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricRoutes);

// Error handling
app.use(errorHandler);

export { app }; 