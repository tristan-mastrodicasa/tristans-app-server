import express from 'express';
import { createConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import { httpErrorMiddleware } from 'shared/helpers';
import indexRouter from 'routers/index.router';
import env from 'conf/env';
import 'conf/passport';
import passport from 'passport';

/** @todo Make sure the charset is utf8mb4 */
createConnection(ormconfig).then((_connection) => {

  const server = express();
  const port: number = Number(process.env.PORT) || 3000;

  // Data configuration //
  server.use(express.json());
  server.use(
    express.urlencoded({
      extended: true,
    }),
  );

  server.use(passport.initialize());
  server.use(passport.session());

  // Heads up to accessed routes during development //
  if (!env.production) {
    server.use((req, _res, next) => {
      console.log(req.originalUrl);
      next();
    });
  }

  // Set server side headers //
  server.use((_req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); /** @todo Change in production to prevent XSRF attacks */
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();

  });

  // Set the default router //
  server.use('/', indexRouter);

  // Error handling //
  server.use(httpErrorMiddleware);

  server.listen(port, async () => {

    console.log(`Server up and running on localhost:${port}`);

  });

}).catch(error => console.log(`An error has occured ${error}`));
