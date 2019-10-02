import { Router } from 'express';
import passport from 'passport';

import { Canvas } from 'database/entities/canvas.entity';

const router = Router({ mergeParams: true });

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
