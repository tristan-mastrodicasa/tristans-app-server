import {Schema} from 'mongoose';

export default Schema({
  cid: Schema.Types.ObjectId, ref: 'Canvas',
  uid: Schema.Types.ObjectId, ref: 'User',
  points: Number,
});

