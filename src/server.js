import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'dev';

app.listen(PORT, () =>
  console.log(`Server running in ${env} mode on port ${PORT}`)
);
