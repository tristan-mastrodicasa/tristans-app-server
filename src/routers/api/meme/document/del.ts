import { Router } from 'express';
import passport from 'passport';

import { Meme } from 'database/entities/meme.entity';

const router = Router({ mergeParams: true });

/**
 * @api {delete} /meme/:id Delete meme document
 * @apiName DeleteMeme
 * @apiGroup Meme
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the meme
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized to delete
 * @apiError (HTTP Error Codes) 404 Cannot find meme
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const meme = await Meme.findOne(req.params.id, { relations: ['user'] });

  // Does canvas exist //
  if (meme) {

    // Does the user have permission to delete the canvas //
    if (meme.user.id === req.user.id) {
      await meme.remove();
      return res.status(204).send();
    }

    return res.status(401).send();

  }

  return next({ content: [{ detail: 'Meme not found' }], status: 404 });

});

export default router;
