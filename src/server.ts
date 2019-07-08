import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { initialize } from 'passport';
// import {cookieParser} from 'cookie-parser';

import RoutesHandler from './routes/routes-handler';

import { connectDatabase } from './database/connection';

export async function bootstrapServer() {
  await connectDatabase();
  const server = express();
  const port = process.env.PORT || 3000;

  server.use(initialize());
  server.use(express.json());
  server.use(
    express.urlencoded({
      extended: true,
    }),
  );
  // server.use(cookieParser());

  // Set server side headers //
  server.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change in production to prevent XSRF attacks
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // server.use('/', RoutesHandler);

  server.listen(port, async () => {
    console.log(`Server up and running on localhost:${port}`);
  });
}
