import {Schema} from 'mongoose';

export default Schema({
  uid: Schema.Types.ObjectId, ref: 'User',
  description: String,
  image_path: String,
  public: Boolean,
  points: Number,
  utc_time: Date,
  active: Boolean,
});

