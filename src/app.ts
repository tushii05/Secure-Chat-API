import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import convRoutes from './modules/conversations/conv.routes';
import msgRoutes from './modules/messages/messages.routes';

const app = express();

// Core Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));

// Rate Limit
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/conversations', convRoutes);
app.use('/messages', msgRoutes);


const swaggerDocument = YAML.load(
  path.join(__dirname, '../docs/openapi.yaml')
);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));
// Error Handler
app.use(errorHandler);

export default app;
