import { Meme } from 'database/entities/meme.entity';
import { createNewMeme } from 'shared/helpers';

/**
 * Create a phony meme
 * @param  canvasid Canvas to link the meme to
 * @param  userid   User to link the meme too
 * @return          meme
 */
export async function getPhonyMeme(canvasid: number, userid: number): Promise<Meme> {

  // Generate a phony canvas //
  const idealMeme = new Meme();
  idealMeme.imagePath = `${Math.random() * 10000}.jpg`; // unique image path
  idealMeme.mimetype = 'image/jpeg';

  return createNewMeme(idealMeme, canvasid, userid);

}
