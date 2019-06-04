import { model, Schema } from 'mongoose';

export default model('Meme', new Schema({
  cid: Schema.Types.ObjectId, ref: 'Canvas',
  uid: Schema.Types.ObjectId, ref: 'User',
  image_path: String, // Only data currently to be stored for the induvidual memes
  stars: Number,
  utc_time: Date,
}));
