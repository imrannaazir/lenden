import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundHandler from './app/middleware/notFoundHandler';
const app: Application = express();

// parser
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1', (req, res) => {
  res.send('Hello World!');
});

// handle not found error
app.use(notFoundHandler);

export default app;
