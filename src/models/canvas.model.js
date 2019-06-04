import { model, Schema } from 'mongoose';

export default model('Canvas', new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  image_path: String,
  visbility: { type: String, enum: ['public', 'followers', 'follow_backs', 'specific_users'] },
  stars: Number,
  utc_time: Date,
}));
