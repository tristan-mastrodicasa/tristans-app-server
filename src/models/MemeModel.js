import {model} from 'mongoose';
import memeSchema from './schemes/memeSchema';

export default model('Meme', memeSchema);

