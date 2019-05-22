import mongoose from 'mongoose';

const connectionURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/meme-api';
const debug = process.env.DEBUG || true;

mongoose.set('debug', debug);
const connection = mongoose.connect(connectionURI, {useNewUrlParser: true}).then(() => {
  console.log('Connetected to mongodb');
}).catch((error) => {
  throw new Error(error);
});

export default connection;


