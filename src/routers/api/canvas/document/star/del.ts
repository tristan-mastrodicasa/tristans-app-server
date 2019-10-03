import { Router } from 'express';
import passport from 'passport';
import { canvasReactmanager } from 'shared/helpers';
import { Canvas } from 'database/entities/canvas.entity';

const router = Router({ mergeParams: true });

/**
 * @api {delete} /canvas/:id/star Remove a react from a canvas
 * @apiName DeleteReactCanvas
 * @apiGroup Canvas
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the canvas
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized to react
 * @apiError (HTTP Error Codes) 404 Cannot find canvas
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const canvas = await Canvas.findOne(req.params.id);

  // Does canvas exist //
  if (canvas) {

    await canvasReactmanager('remove', req.params.id, req.user.id);
    return res.status(200).send();

  }

  return next({ content: [{ detail: 'Canvas not found' }], status: 404 });

});

export default router;
