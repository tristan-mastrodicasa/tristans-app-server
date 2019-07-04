import { model, Schema } from 'mongoose';

export default model('Meme', new Schema({
  cid: { type: Schema.Types.ObjectId, ref: 'Canvas' },
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  imagePath: String, // Only data currently to be stored for the induvidual memes
  stars: Number,
  utcTime: Date,
}));
