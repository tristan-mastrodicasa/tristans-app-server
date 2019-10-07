import { Router } from 'express';
import passport from 'passport';
import { memeReactManager } from 'shared/helpers';
import { Meme } from 'database/entities/meme.entity';

const router = Router({ mergeParams: true });

/**
 * @api {delete} /meme/:id/star Remove a react from a meme
 * @apiName DeleteReactMeme
 * @apiGroup Meme
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the meme
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized to remove react
 * @apiError (HTTP Error Codes) 404 Cannot find meme
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const meme = await Meme.findOne(req.params.id);

  // Does meme exist //
  if (meme) {

    await memeReactManager('remove', req.params.id, req.user.id);
    return res.status(200).send();

  }

  return next({ content: [{ detail: 'Meme not found' }], status: 404 });

});

export default router;
