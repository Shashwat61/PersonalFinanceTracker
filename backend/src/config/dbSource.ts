import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV}`
dotenv.config({ path: envFile });
// change this getting env from explicitly defining here
const dbSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  logger: 'advanced-console',
  entities: [process.env.DB_ENTITIES_PATH as string],
  migrations: [process.env.DB_MIGRATIONS_PATH as string],
});

export { dbSource };
