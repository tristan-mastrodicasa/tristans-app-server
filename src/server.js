import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import {connection} from './database/connection';
import passportConfig from './passport/passport';
import RoutesHandler from './routes/routes_handler';

const server = express();
const port = process.env.PORT || 3000;


server.use(passport.initialize());
server.use(express.json());
server.use(express.urlencoded({
  extended: true,
}));
server.use(cookieParser());

server.use('/api', RoutesHandler);

server.listen(port, () => {
  console.log(`Server up and running on localhost:${port}`);
});
