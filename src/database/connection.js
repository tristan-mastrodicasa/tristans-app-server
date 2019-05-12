import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);
const connectionURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meme-api';
const debug = process.env.DEBUG || false;

mongoose.set('debug', debug);

export const connection = mongoose.connect(connectionURI, {useNewUrlParser: true});
export const store = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
});


