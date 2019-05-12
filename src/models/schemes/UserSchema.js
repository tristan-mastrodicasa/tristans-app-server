import {Schema} from 'mongoose';

export default Schema({
  firstname: String,
  lastname: String,
  facebook: {
    accessToken: String,
    profileId: String,
  },
});

