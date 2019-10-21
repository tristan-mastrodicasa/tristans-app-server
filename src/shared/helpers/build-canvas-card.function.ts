import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { ContentCard, EContentType } from 'shared/models';
import { buildImageUrl } from 'shared/helpers';

/**
 * Build a canvas card from the canvas record + user relation and the client user
 * @param  canvas       Canvas record from the database
 * @param  clientUserId Client user id
 */
export async function buildCanvasCard(canvas: Canvas, clientUserId?: any): Promise<ContentCard> {

  let userReacted = undefined;

  // Check if the canvas has been starred by the client user //
  if (clientUserId) {
    userReacted = await CanvasReacts.findOne({ canvas, user: clientUserId });
  }

  return {
    type: EContentType.Canvas,
    id: canvas.id,
    users: {
      primary: {
        id: canvas.user.id,
        firstName: canvas.user.firstName,
        username: canvas.user.username,
        photo: buildImageUrl('user', canvas.user.profileImg) },
    },
    imagePath: buildImageUrl('canvas', canvas.imagePath),
    description: canvas.description,
    stars: canvas.stars,
    starred: (userReacted ? true : false),
    utcTime: +canvas.utc,
  };

}
