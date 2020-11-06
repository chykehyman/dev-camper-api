import express from 'express';
import morgan from 'morgan';
import 'colors';

import connectDB from './db.config';
import errorHandler from './middlewares/errorHandler';
import bootcamp from './routes/bootcamp';

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
app.use(express.json());
app.use('/api/v1/bootcamps', bootcamp);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running in ${env} mode on port ${PORT}`.yellow.bold)
);

process.on('unhandledRejection', (error) => {
  console.log(`${error.name}: ${error.message}`.bgRed.black);
  server.close(() => process.exit(1));
});
