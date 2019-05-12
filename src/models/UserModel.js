import {model} from 'mongoose';
import userSchema from './schemes/UserSchema';

export default model('User', userSchema);

