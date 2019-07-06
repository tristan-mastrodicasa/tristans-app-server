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

// Set server side headers //
server.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*'); // Change in production to prevent XSRF attacks
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();

});

server.use('/', RoutesHandler);

// Error handling //
server.use((err, req, res, next) => {

  return res.status(err.status || 400).send({ error: err.content });

});

server.listen(port, () => {

  console.log(`Server up and running on localhost:${port}`);

});
