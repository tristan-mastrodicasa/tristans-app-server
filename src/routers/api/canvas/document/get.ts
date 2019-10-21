import { Router } from 'express';
import passport from 'passport';
import { Canvas } from 'database/entities/canvas.entity';
import { buildCanvasCard } from 'shared/helpers';

const router = Router({ mergeParams: true });

/**
 * @api {get} /canvas/:id Get a canvas document
 * @apiName GetCanvas
 * @apiGroup Canvas
 *
 * @apiHeader (Optional Headers) Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the canvas
 *
 * @apiSuccess (200) {Object} contentCard JSON object describing the canvas content card
 *
 * @apiError (HTTP Error Codes) 404 Cannot find canvas
 */
router.get('/', async (req, res, next) => {

  passport.authenticate('jwt', { session: false }, async (_err, user, _info) => {

    const canvas = await Canvas.findOne(req.params.id, { relations: ['user'] });

    if (canvas) {

      /** @todo consider centeralizing content card building */
      const contentCard = await buildCanvasCard(canvas, user);

      return res.send(contentCard);

    }

    return next({ content: [{ detail: 'Canvas not found' }], status: 404 });

  })(req, res, next);

});

export default router;
