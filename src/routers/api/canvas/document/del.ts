import { Router } from 'express';
import passport from 'passport';

import { Canvas } from 'database/entities/canvas.entity';

const router = Router({ mergeParams: true });

/**
 * @api {delete} /canvas/:id Delete canvas document
 * @apiName DeleteCanvas
 * @apiGroup Canvas
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the canvas
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized to delete
 * @apiError (HTTP Error Codes) 404 Cannot find canvas
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const canvas = await Canvas.findOne(req.params.id, { relations: ['user'] });

  // Does canvas exist //
  if (canvas) {

    // Does the user have permission to delete the canvas //
    if (canvas.user.id === req.user.id) {
      await canvas.remove();
      return res.status(204).send();
    }

    return res.status(401).send();

  }

  return next({ content: [{ detail: 'Canvas not found' }], status: 404 });

});

export default router;
