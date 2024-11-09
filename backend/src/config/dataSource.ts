import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV}`
dotenv.config({ path: envFile });
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  migrations: [process.env.DB_DATA_MIGRATIONS_PATH as string],
  migrationsTableName: process.env.DB_DATA_MIGRATION_TABLE,
});

export { dataSource };
