import { ConnectionOptions } from 'typeorm';
import path from 'path';
import env from './env';

export const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: env.database_username,
  password: env.database_password,
  database: 'tristans_app',
  charset: 'utf8mb4',
  logging: false,
  entities: [
    `${path.resolve(__dirname)}/../database/entities/*.entity{.ts,.js}`,
  ],
  migrations: [],
  subscribers: [],
  cli: {
    entitiesDir: 'src/database/entity',
    migrationsDir: 'src/database/migration',
    subscribersDir: 'src/database/subscriber',
  },
  synchronize: env.rebuild_database,
};
