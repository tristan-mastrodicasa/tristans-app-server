import { Router } from 'express';
import passport from 'passport';
import { MemeReacts } from 'database/entities/meme-reacts.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import { ContentCard, EContentType } from 'shared/models';
import { getConnection } from 'typeorm';

import env from 'conf/env';

const router = Router({ mergeParams: true });

 /**
  * @api {get} /canvas/:id/memes Get a list of memes for a specific canvas document
  * @apiName GetCanvasMemes
  * @apiGroup Canvas
  *
  * @apiHeader (Optional Headers) Authorization Bearer [token]
  *
  * @apiParam {Number} id The id of the canvas
  *
  * @apiSuccess (200) {Array} contentCard Array of JSON objects describing the meme content card
  *
  * @apiError (HTTP Error Codes) 404 Cannot find memes
  */
router.get('/', async (req, res, next) => {

  passport.authenticate('jwt', { session: false }, async (_err, user, _info) => {

    // Container for returned memes //
    const contentCardList: ContentCard[] = [];

    // Does the canvas exist //
    const canvas = await Canvas.findOne(req.params.id);

    if (canvas) {

      // Get a list of memes for the defined canvas //
      const memes = await getConnection()
        .getRepository(Meme)
        .createQueryBuilder('meme')
        .leftJoinAndSelect('meme.user', 'user')
        .where('meme.canvas = :canvasid', { canvasid: req.params.id })
        .orderBy('stars', 'DESC')
        .limit(75)
        .getMany();

      for (const meme of memes) {

        let userReacted = undefined;

        // Check if the meme has been starred by the user //
        if (user) {
          userReacted = await MemeReacts.findOne({ meme, user });
        }

        // Compile the card for shipping //
        const contentCard: ContentCard = {
          type: EContentType.Meme,
          id: meme.id,
          users: {
            primary: {
              id: meme.user.id,
              firstName: meme.user.firstName,
              username: meme.user.username,
              photo: meme.user.profileImg,
            },
          },
          imagePath: `${env.host}/api/meme/image/${meme.imagePath}`,
          stars: meme.stars,
          starred: (userReacted ? true : false),
          utcTime: +meme.utc,
        };

        contentCardList.push(contentCard);

      }

    }

    if (contentCardList.length > 0) return res.json(contentCardList);

    return next({ content: [{ detail: 'Nothing here' }], status: 404 });

  })(req, res, next);

});

export default router;
