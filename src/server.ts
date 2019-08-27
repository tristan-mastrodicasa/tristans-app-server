import express from 'express';
import { createConnection } from 'typeorm';
import { ormconfig } from './conf/ormconfig';

import RoutesHandler from './routes/routes-handler';

import { Error } from './utils/response.interface';

import './conf/passport';
import env from './conf/env';
import cookieSesion from 'cookie-session';
import passport from 'passport';

/** @todo Make sure the charset is utf8mb4 */
createConnection(ormconfig).then(_connection => {

  const server = express();
  const port: number = Number(process.env.PORT) || 3000;

  // Data configuration //
  server.use(express.json());
  server.use(
    express.urlencoded({
      extended: true,
    }),
  );

  // Authorization Section //
  server.use(cookieSesion({
    maxAge: 24 * 60 * 60 * 1000,
    keys: env.cookie_keys
  }));

  server.use(passport.initialize());
  server.use(passport.session());

  // Set server side headers //
  server.use((_req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // Change in production to prevent XSRF attacks
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();

  });

  // Set the default router //
  server.use('/', RoutesHandler);

  // Error handling //
  server.use((err: { status: number, content: Error[] }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {

    return res.status(err.status || 400).send({ errors: err.content });

  });

  server.listen(port, async () => {

    console.log(`Server up and running on localhost:${port}`);

  });

}).catch(error => console.log(error));
