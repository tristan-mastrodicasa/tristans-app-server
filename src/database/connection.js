import mongoose from 'mongoose';

const connectionURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meme-api';
const debug = process.env.DEBUG || true;

mongoose.set('debug', debug);

export const connection = mongoose.connect(connectionURI, {useNewUrlParser: true});


