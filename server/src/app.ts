import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundHandler from './app/middleware/notFoundHandler';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import config from './app/config';
const app: Application = express();

// parser
app.use(cors({ credentials: true, origin: [config.client_url as string] }));
app.use(express.json());
app.use(cookieParser());

// all routes
app.use('/api/v1', router);

// handle error
app.use(globalErrorHandler);

// handle not found error
app.use(notFoundHandler);

export default app;
