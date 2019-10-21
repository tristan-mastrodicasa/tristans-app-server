import { Router } from 'express';
import passport from 'passport';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import { ContentCard } from 'shared/models';
import { getConnection } from 'typeorm';
import { buildMemeCard } from 'shared/helpers';

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

        const contentCard = await buildMemeCard(meme, user);

        contentCardList.push(contentCard);

      }

    }

    if (contentCardList.length > 0) return res.json(contentCardList);

    return next({ content: [{ detail: 'Nothing here' }], status: 404 });

  })(req, res, next);

});

export default router;
