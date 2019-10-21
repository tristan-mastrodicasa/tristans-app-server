import { Router } from 'express';
import passport from 'passport';
import { MemeReacts } from 'database/entities/meme-reacts.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import { ContentCard, EContentType } from 'shared/models';
import { buildImageUrl, buildCanvasCard } from 'shared/helpers';
import { Raw } from 'typeorm';

const router = Router({ mergeParams: true });

// Get top 25 canvases + 125 memes for the last 3 days

/**
 * @api {get} /user/:id/daily-suggestions Get content suggestions for a specific user
 * @apiName GetUserSuggested
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user (use 0 for public user)
 *
 * @apiSuccess (200) {ContentCard[]} body Array of JSON objects describing the content cards
 *
 * @apiError (HTTP Error Codes) 404 Cannot find content
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', async (req, res, next) => {

  passport.authenticate('jwt', { session: false }, async (_err, user, _info) => {

    if (user) {
      // If the user does not own this account, REJECT FAM //
      if (user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access daily suggested' }], status: 401 });
    }

    // Container for returned content cards //
    const contentCardList: ContentCard[] = [];

    let bestMemes: Meme[] = [];
    let bestCanvases: Canvas[] = [];

    // If the user is public (userid = 0) or registered //
    if (+req.params.id === 0 || user) {

      /**
       * @todo Better tailor results for specific users when they sign up,
       * Currently all we do is get the best memes and canvases overall fors
       * both public and registered users
       */

      // Get the best memes from the past 3 days //
      bestMemes = await Meme.find({
        relations: ['user', 'canvas', 'canvas.user'],
        where: {
          utc: Raw(alias => `${alias} > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)`),
        },
        order: {
          stars: 'DESC',
        },
        take: 125,
      });

      // Best canvases from last 3 days //
      bestCanvases = await Canvas.find({
        relations: ['user'],
        where: {
          utc: Raw(alias => `${alias} > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)`),
        },
        order: {
          stars: 'DESC',
        },
        take: 25,
      });

      // Combine the meme and canvas arrays //
      const content = [...bestMemes, ...bestCanvases];

      // Sort by UTC decending (newest first) //
      content.sort((a, b) => {
        return +b.utc - +a.utc;
      });

      // Compile cards  //
      for (const entity of content) {

        let userReacted = undefined;
        let contentCard: ContentCard;

        // Compile the card for shipping //
        if (entity instanceof Meme) {

          // Check if the meme has been starred by the user //
          userReacted = await MemeReacts.findOne({ user: user.id, meme: entity });

          contentCard = {
            type: EContentType.MemeWithHost,
            id: entity.id,
            cid: entity.canvas.id,
            users: {
              primary: {
                id: entity.canvas.user.id,
                firstName: entity.canvas.user.firstName,
                username: entity.canvas.user.username,
                photo: buildImageUrl('user', entity.canvas.user.profileImg),
              },
              secondary: {
                id: entity.user.id,
                firstName: entity.user.firstName,
                username: entity.user.username,
                photo: buildImageUrl('user', entity.user.profileImg),
              },
            },
            imagePath: buildImageUrl('meme', entity.imagePath),
            stars: entity.stars,
            starred: (userReacted ? true : false),
            utcTime: +entity.utc,
          };

        } else if (entity instanceof Canvas) contentCard = await buildCanvasCard(entity, user.id);

        contentCardList.push(contentCard);
      }

    } else {
      // Public user trying to access registered user suggested //
      return next({ content: [{ detail: 'Cannot access daily suggested' }], status: 401 });
    }

    if (contentCardList.length > 0) return res.json(contentCardList);

    return next({ content: [{ detail: 'Nothing here' }], status: 404 });

  })(req, res, next);

});

export default router;
