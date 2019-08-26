/**
 * Environment variables for the server
 * You need to create the env.dev.ts and env.prod.ts files
 * with the objects following the correct interface
 */
import { Env } from './env.interface';

import devEnv from './env.dev';
import prodEnv from './env.prod';

let env: Env;

 if (process.env.NODE_ENV == 'development') env = devEnv;
 else env = prodEnv;

export default env;
