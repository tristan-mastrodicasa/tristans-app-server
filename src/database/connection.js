import mongoose from 'mongoose';

const connectionURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meme-api';
console.log(connectionURI);
const debug = process.env.DEBUG || true;

mongoose.set('debug', debug);
const connection = mongoose.connect(connectionURI, {useNewUrlParser: true}).then(() => {
  console.log('Connected to mongodb');
}).catch((error) => {
  throw new Error(error);
});

export default connection;
