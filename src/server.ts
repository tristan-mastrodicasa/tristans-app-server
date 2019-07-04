import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import RoutesHandler from './routes/routes-handler';

import './database/connection';
import './passport/passport';

const server = express();
const port = process.env.PORT || 3000;

server.use(passport.initialize());
server.use(express.json());
server.use(express.urlencoded({
  extended: true,
}));
server.use(cookieParser());

server.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();

});

server.use('/', RoutesHandler);

server.listen(port, () => {

  console.log(`Server up and running on localhost:${port}`);

});
