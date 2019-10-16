import { User } from 'database/entities/user.entity';
import { Meme } from 'database/entities/meme.entity';
import { MemeReacts } from 'database/entities/meme-reacts.entity';
import { EInfluence } from 'shared/models';
import { userInfluenceManager } from 'shared/helpers';

/**
 * Add and remove reacts from memes
 * @param  action Add or remove react
 * @param  memeid Id of the meme to react to
 * @param  userid Who is reacting
 */
export async function memeReactManager(action: 'add' | 'remove', memeid: number, userid: number): Promise<void> {

  const user = await User.findOne(userid);
  const meme = await Meme.findOne(memeid, { relations: ['user'] });

  // Check react status //
  const hasReacted = await MemeReacts.findOne({ meme, user });

  // Do nothing if the action has already occured //
  if (hasReacted && action === 'add') return;
  if (!hasReacted && action === 'remove') return;

  if (action === 'add') {

    const reactsRecord = new MemeReacts();
    reactsRecord.meme = meme;
    reactsRecord.user = user;
    await reactsRecord.save();

  } else if (action === 'remove') {

    await hasReacted.remove();

  }

  // Update meme star stats //
  meme.stars = await MemeReacts.count({ where: { meme: memeid } });
  await meme.save();

  // Update influence of the meme owner //
  await userInfluenceManager(action, meme.user.id, EInfluence.star);

}
