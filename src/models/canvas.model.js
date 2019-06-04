import { model, Schema } from 'mongoose';

export default model('Canvas', new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  image_path: String,
  public: Boolean,
  points: Number,
  utc_time: Date,
  active: Boolean,
}));
