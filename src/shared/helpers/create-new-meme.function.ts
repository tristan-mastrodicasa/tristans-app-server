import { User } from 'database/entities/user.entity';
import { Meme } from 'database/entities/meme.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { validate, ValidationError } from 'class-validator';
import { EInfluence } from 'shared/models';
import { userInfluenceManager, userContentNumberManager, NotificationManager } from 'shared/helpers';

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
  await userContentNumberManager('add', user.id, 1);

  // Owner of meme should not get influence or notification if memeing own canvas //
  if (userid !== canvas.user.id) {
    // Update influence of the canvas owner //
    await userInfluenceManager('add', canvas.user.id, EInfluence.memeCreated);

    // Notify the canvas owner of the new meme //
    NotificationManager.sendUserCreatedMemePushNotification(canvas.user.id, canvas.id, user.username);
  }

  return meme.save();

}
