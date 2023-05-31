import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import './crons';
import path from 'path';

dotenv.config();

const app = express();

app.use('/static', express.static(path.join(process.cwd(), 'public')));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/ping', async (_req, res) => {
  res.json({
    message: 'pong',
  });
});


export default app;
