import mongoose from 'mongoose';

const connectionURI = process.env.MONGO_URL || 'mongodb://localhost:27017/meme-api';
const debug = process.env.DEBUG || true;

console.log(connectionURI);

mongoose.set('debug', debug);
mongoose.connect(connectionURI, { useNewUrlParser: true, useFindAndModify: false }).then(() => {

  console.log('Connected to mongodb');

}).catch((error) => {

  throw new Error(error);

});