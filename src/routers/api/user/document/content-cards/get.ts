import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import { ContentCard } from 'shared/models';
import { buildMemeWithHostCard, buildCanvasCard } from 'shared/helpers';

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
     * @todo Write unit tests to properly test if the 'starred' property is returned correctly
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

      let contentCard: ContentCard;

      // Compile the card for shipping //
      if (entity instanceof Meme) contentCard = await buildMemeWithHostCard(entity, req.user.id);
      else if (entity instanceof Canvas) contentCard = await buildCanvasCard(entity, req.user.id);

      contentCardList.push(contentCard);
    }

  }

  if (contentCardList.length > 0) return res.json(contentCardList);

  return next({ content: [{ detail: 'Nothing here' }], status: 404 });

});

export default router;
