import { model, Schema } from 'mongoose';
import Error from '../util/error.util';

/**
 * The canvas model describes everything stored per canvas
 * Any input with a validator is input assumed to come from the user
 * @type {Model}
 */
export default model('Canvas', new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  description: {
    type: String,
    validate: {
      validator: Error.mongoose('canvasDescription'),
    },
    default: null,
  },
  imagePath: String,
  visibility: { type: String, enum: ['public', 'followers', 'follow_backs', 'specific_users'] },
  stars: Number,
  utcTime: Date,
}));
