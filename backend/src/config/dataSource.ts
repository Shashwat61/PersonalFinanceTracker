import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'shashwat',
  password: '',
  database: 'financetracker',
  logging: true,
  migrations: ['./src/migrations/data/*.ts'],
  migrationsTableName: 'data_migrations',
});

export { dataSource };
