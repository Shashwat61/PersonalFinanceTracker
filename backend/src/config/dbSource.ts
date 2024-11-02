import { DataSource } from 'typeorm';

const dbSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'shashwat',
  password: '',
  database: 'financetracker',
  logging: true,
  logger: 'advanced-console',
  entities: ['./src/entity/*.ts'],
  migrations: ['./src/migrations/db/*.ts'],
});

export { dbSource };
