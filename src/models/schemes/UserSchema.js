import {Schema} from 'mongoose';

export default Schema({
  fbid: Number,
  username: String,
  firstname: String,
  lastname: String,
  profile: {
    notification_settings: {
      disabled: {
        type: Boolean, default: false,
      },
    },
    photos: [
      {
        image_name: String,
        image_path: String,
      },
    ],
    native_app_installed: {
      type: Boolean, default: false,
    },
  },
  statistics: {
    influence: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: Schema.Types.ObjectId, ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId, ref: 'User',
      },
    ],
  },
});

