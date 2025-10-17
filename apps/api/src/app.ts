import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error';


const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.APP_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// health
app.get('/health', (_req, res) => res.json({ ok: true }));



// error handler
app.use(errorHandler);

export default app;
