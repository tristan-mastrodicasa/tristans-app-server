import { Meme } from 'database/entities/meme.entity';
import { MemeReacts } from 'database/entities/meme-reacts.entity';
import { ContentCard, EContentType } from 'shared/models';
import { buildImageUrl } from 'shared/helpers';

/**
 * Build a meme card with it's canvas owner
 * @param  meme         The meme record with its canvas and user relation
 * @param  clientUserId Client user id
 */
export async function buildMemeWithHostCard(meme: Meme, clientUserId?: any): Promise<ContentCard> {

  let userReacted = undefined;

  // Check if the meme has been starred by the user //
  userReacted = await MemeReacts.findOne({ meme, user: clientUserId });

  return {
    type: EContentType.MemeWithHost,
    id: meme.id,
    cid: meme.canvas.id,
    users: {
      primary: {
        id: meme.user.id,
        firstName: meme.user.firstName,
        username: meme.user.username,
        photo: buildImageUrl('user', meme.user.profileImg),
      },
      secondary: {
        id: meme.canvas.user.id,
        firstName: meme.canvas.user.firstName,
        username: meme.canvas.user.username,
        photo: buildImageUrl('user', meme.canvas.user.profileImg),
      },
    },
    imagePath: buildImageUrl('meme', meme.imagePath),
    stars: meme.stars,
    starred: (userReacted ? true : false),
    utcTime: +meme.utc,
  };

}
