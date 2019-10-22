import { ConnectionOptions } from 'typeorm';
import path from 'path';
import env from './env';

export const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: env.database_host,
  port: env.database_port,
  username: env.database_username,
  password: env.database_password,
  database: 'tristans_app',
  charset: 'utf8mb4',
  logging: false,
  entities: [
    `${path.resolve(__dirname)}/../database/entities/*.entity{.ts,.js}`,
  ],
  synchronize: env.rebuild_database,
};
