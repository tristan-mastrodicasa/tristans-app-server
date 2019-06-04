import { model, Schema } from 'mongoose';

export default model('Canvas', new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  imagePath: String,
  visibility: { type: String, enum: ['public', 'followers', 'follow_backs', 'specific_users'] },
  stars: Number,
  utcTime: Date,
}));
