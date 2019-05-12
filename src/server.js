import express from 'express';
import passport from 'passport';
import session from 'express-session';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import {store} from './database/connection';

import passportConfig from './passport/passport';
import RoutesHandler from './routes/routes_handler';

const server = express();
const port = process.env.PORT || 3000;

server.use(session({
  secret: 'foo',
  saveUninitialized: false,
  store: store,
}));

server.use(passport.initialize());
server.use(passport.session());
server.use(express.json());
server.use(express.urlencoded({
  extended: true,
}));
server.use(cookieParser());

server.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

server.use('/api', RoutesHandler);

server.listen(port, () => {
  console.log(`Server up and running on localhost:${port}`);
});
