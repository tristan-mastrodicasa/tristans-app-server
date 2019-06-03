import { model, Schema } from 'mongoose';

export default model('Meme', new Schema({
  cid: Schema.Types.ObjectId, ref: 'Canvas',
  uid: Schema.Types.ObjectId, ref: 'User',
  points: Number,
}));
