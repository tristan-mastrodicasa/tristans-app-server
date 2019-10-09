import { User } from 'database/entities/user.entity';
import { Meme } from 'database/entities/meme.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { validate, ValidationError } from 'class-validator';
import { EInfluence } from 'shared/models';

/**
 * Create a meme along with all of it's associated relations
 * @param  meme     Meme Object
 * @param  canvasid The id of the host canvas
 * @param  userid   The userid of the meme owner
 * @return          The created meme record
 */
export async function createNewMeme(meme: Meme, canvasid: number, userid: number): Promise<Meme> {

  // Validate the meme record //
  const res = await validate(meme);
  if (res.length > 0) {
    throw res;
  }

  const user = await User.findOne(userid, { relations: ['statistics', 'memes'] });
  const canvas = await Canvas.findOne(canvasid, { relations: ['user'] });

  // Link relations //
  meme.user = user;
  meme.canvas = canvas;

  // Validate that the user has uploaded less than 20 memes a day //
  const memeList = user.memes;

  if (memeList.length >= 20) {

    const canvas = memeList[memeList.length - 20];
    const diffTime = +new Date() - +canvas.utc;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      const error = new ValidationError();
      error.property = 'meme';
      error.constraints = { limit: 'Client can only upload 20 memes a day' };
      error.children = [];
      throw [error];
    }

  }

  // Update user stats //
  user.statistics.contentNum += 1;
  await user.statistics.save();

  // Owner of meme should not get influence if memeing own canvas //
  if (userid !== canvas.user.id) {
    const canvasOwner = await User.findOne(canvas.user.id, { relations: ['statistics'] });
    canvasOwner.statistics.influence += EInfluence.memeCreated;
    await canvasOwner.statistics.save();
  }

  return meme.save();

}
