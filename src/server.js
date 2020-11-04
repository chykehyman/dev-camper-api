import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colors';

import connectDB from './db.config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'dev';

connectDB();

app.use(
  morgan(
    // eslint-disable-next-line max-len
    '":method :url HTTP/:http-version" :status :res[content-length] :remote-addr - :remote-user [:date[clf]]'
      .green.italic.bold,
    {
      skip: (req, res) => env === 'production' && res.statusCode < 400,
    }
  )
);

const server = app.listen(PORT, () =>
  console.log(`Server running in ${env} mode on port ${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (error) => {
  console.log(`${error.name}: ${error.message}`.bgRed.black);
  server.close(() => process.exit(1));
});
