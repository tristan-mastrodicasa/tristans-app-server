import express from 'express';
import { createConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import { WebsiteAnalytics } from 'database/entities/website-analytics.entity';
import { httpErrorMiddleware } from 'shared/helpers';
import { EDeviceType } from 'shared/models';
import indexRouter from 'routers/index.router';
import env from 'conf/env';
import 'conf/passport';
import passport from 'passport';

/** @todo Make sure the charset is utf8mb4 */
createConnection(ormconfig).then((_connection) => {

  const server = express();
  const port: number = 80;

  // Set view engine //
  server.set('view engine', 'ejs');

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
      console.log(`${req.method} ${req.originalUrl}`);
      next();
    });
  }

  server.set('trust proxy', true);

  // Log website access (analytics) //
  server.use((req, _res, next) => {

    if ((req.path.includes('/canvas') || req.path === '/' || req.path.includes('/playstore') || req.path.includes('/influencers')) && !req.path.includes('/api')) {

      const webAnalytics = new WebsiteAnalytics();
      const ua = req.headers['user-agent'];
      let deviceType = EDeviceType.Other;

      if (/Android/.test(ua)) deviceType = EDeviceType.Android;
      if (/like Mac OS X/.test(ua)) deviceType = EDeviceType.Ios;

      webAnalytics.deviceType = deviceType;
      webAnalytics.ip = req.ip;
      webAnalytics.endPoint = req.path;
      webAnalytics.query = req.url.substr(req.url.indexOf('?') + 1);

      webAnalytics.save();
    }

    next();

  });

  // Set server side headers //
  server.use((_req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); /** @todo Change in production to prevent XSRF attacks */
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
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
