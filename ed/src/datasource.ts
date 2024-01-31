import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const GUSystemDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  database: process.env.DATABASE_SCHEMA,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logger: 'advanced-console',
  logging: 'all',
  cache: true,
  migrationsRun: true,
  entities: ['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
} as DataSourceOptions);

export async function initialize() {
  console.log(
    `Connecting to SQL Instance on: ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_SCHEMA}`
  );

  await GUSystemDataSource.initialize();
}
