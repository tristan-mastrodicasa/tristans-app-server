import { Router } from 'express';
import passport from 'passport';
import { MemeReacts } from 'database/entities/meme-reacts.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import { ContentCard, EContentType } from 'shared/models';

import env from 'conf/env';

const router = Router({ mergeParams: true });

/**
 * @api {get} /user/:id/content-cards Get the most recent content cards for a specific user
 * @apiName GetUserContent
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {ContentCard[]} body Array of JSON objects describing the content cards
 *
 * @apiError (HTTP Error Codes) 404 Cannot find user / content
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // Container for returned content cards //
  const contentCardList: ContentCard[] = [];

  // Get user //
  const user = await User.findOne(
    req.params.id,
    { relations: ['canvases', 'canvases.user', 'memes', 'memes.user', 'memes.canvas', 'memes.canvas.user'] },
  );

  if (user) {

    /**
     * @todo load only recent memes and canvases to enable that ephemeral effect
     * outlined in the business strategy
     */

    // Combine the meme and canvas arrays //
    let content = [...user.memes, ...user.canvases];

    // Sort by UTC decending (newest first) //
    content.sort((a, b) => {
      return +b.utc - +a.utc;
    });

    // Limit 100 content cards //
    content = content.splice(0, 100);

    // Compile cards  //
    for (const entity of content) {

      let userReacted = undefined;
      let contentCard: ContentCard;

      // Compile the card for shipping //
      if (entity instanceof Meme) {

        // Check if the meme has been starred by the user //
        userReacted = await MemeReacts.findOne({ user, meme: entity });

        contentCard = {
          type: EContentType.MemeWithHost,
          id: entity.id,
          cid: entity.canvas.id,
          users: {
            primary: {
              id: entity.user.id,
              firstName: entity.user.firstName,
              username: entity.user.username,
              photo: entity.user.profileImg,
            },
            secondary: {
              id: entity.canvas.user.id,
              firstName: entity.canvas.user.firstName,
              username: entity.canvas.user.username,
              photo: entity.canvas.user.profileImg,
            },
          },
          imagePath: `${env.host}/api/meme/image/${entity.imagePath}`,
          stars: entity.stars,
          starred: (userReacted ? true : false),
          utcTime: +entity.utc,
        };

      } else if (entity instanceof Canvas) {

        // Check if the meme has been starred by the user //
        userReacted = await CanvasReacts.findOne({ user, canvas: entity });

        contentCard = {
          type: EContentType.Canvas,
          id: entity.id,
          users: {
            primary: {
              id: entity.user.id,
              firstName: entity.user.firstName,
              username: entity.user.username,
              photo: entity.user.profileImg,
            },
          },
          description: entity.description,
          imagePath: `${env.host}/api/meme/image/${entity.imagePath}`,
          stars: entity.stars,
          starred: (userReacted ? true : false),
          utcTime: +entity.utc,
        };
      }

      contentCardList.push(contentCard);
    }

  }

  if (contentCardList.length > 0) return res.json(contentCardList);

  return next({ content: [{ detail: 'Nothing here' }], status: 404 });

});

export default router;
