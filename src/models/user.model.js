import { model, Schema } from 'mongoose';

export default model('User', new Schema({
  fbid: Number,
  username: String,
  first_name: String,
  last_name: String,
  photo: String, // Path
  influence: { type: Number, default: 0 },
  settings: { // Can be updated
    notifications: {
      disabled: { type: Boolean, default: false },
    },
  },
  network: {
    followers: {
      count: Number,
      users: [
        {
          type: Schema.Types.ObjectId, ref: 'User',
        },
      ],
    },
    following: {
      count: Number,
      users: [
        {
          type: Schema.Types.ObjectId, ref: 'User',
        },
      ],
    },
  },
  notifications: [
    {
      name: { type: String, enum: ['friends_joined_service', 'invitation', 'level_up'] }, // Can be updated
      data: Schema.Types.Mixed,
    },
  ],
  activity: [
    {
      hid: Schema.Types.ObjectId,
      host_type: { type: String, enum: ['user', 'meme', 'canvas', 'global'] },
      action_type: { type: String, enum: ['follow', 'star', 'upload', 'update_username'] }, // Can be updated
      utc_time: Date,
    },
  ],
  misc: {
    native_app_installed: { type: Boolean, default: false },
  },
}));
