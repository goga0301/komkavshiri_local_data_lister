import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/health', (_req, res) => {
  res.send({ status: 'Backend is healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});