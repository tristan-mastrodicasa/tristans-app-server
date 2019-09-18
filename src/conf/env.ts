/**
 * Environment variables for the server
 * You need to create the env.dev.ts and env.prod.ts files
 * with the objects following the correct interface
 */
import { Env } from './env.interface';

import envDev from './env.dev';
import envProd from './env.prod';

let env: Env;

if (process.env.NODE_ENV === 'development') env = envDev;
else env = envProd;

export default env;
