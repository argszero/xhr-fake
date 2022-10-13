import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/api/hello', (req: Request, res: Response) => {
  console.log('receive request from client')
  res.json({
    code: 200,
    message: 'I am response from server'
  })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});