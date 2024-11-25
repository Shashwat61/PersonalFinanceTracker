import express from 'express';
import cors from 'cors';
import router from './routes';
import 'dotenv/config';
import { redisClient } from './lib';
import { dbSource } from './config/dbSource';
import { dataSource } from './config/dataSource';

const app = express();
const port = process.env.PORT || 3000;
const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: process.env.NODE_ENV === 'production',
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.set('views', './views');
app.set('view engine', 'pug');

app.listen(port, async () => {
  dbSource
    .initialize()
    .then(() => {
      console.log('DB Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during DB Source initialization', err);
    });
  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  await redisClient.connect();
  console.log(`Example app listening on port ${port}!`);
});
