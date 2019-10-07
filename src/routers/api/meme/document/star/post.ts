import { Router } from 'express';
import passport from 'passport';
import { memeReactManager } from 'shared/helpers';
import { Meme } from 'database/entities/meme.entity';

const router = Router({ mergeParams: true });

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const meme = await Meme.findOne(req.params.id);

  // Does meme exist //
  if (meme) {

    await memeReactManager('add', req.params.id, req.user.id);
    return res.status(200).send();

  }

  return next({ content: [{ detail: 'Meme not found' }], status: 404 });

});

export default router;
