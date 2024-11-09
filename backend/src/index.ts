import express from 'express';
import cors from 'cors';
import router from './routes';
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV}`
dotenv.config({ path: envFile });
import { redisClient } from './lib';
import { dataSource } from './config/dataSource';
import { dbSource } from './config/dbSource';



const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.set('views', './views');
app.set('view engine', 'pug');

app.listen(port, async () => {
  
  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
    dbSource
    .initialize()
    .then(() => {
      console.log('DB Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during DB Source initialization', err);
    });
  await redisClient.connect();
  console.log(`Example app listening on port ${port}!`);
});
