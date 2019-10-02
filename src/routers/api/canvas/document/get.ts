import { Router } from 'express';
import passport from 'passport';
import { getConnection } from 'typeorm';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { ContentCard, EContentType } from 'shared/models';

import env from 'conf/env';

const router = Router({ mergeParams: true });

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const canvas = await Canvas.findOne(req.params.id, { relations: ['user'] });

  if (canvas) {

    // Check if the canvas has been starred //
    const reactCount = await getConnection()
      .getRepository(CanvasReacts)
      .createQueryBuilder('entity')
      .where('userId = :uid AND canvasId= :cid', { uid: canvas.user.id, cid: canvas.id })
      .getCount();

    const contentCard: ContentCard = {
      type: EContentType.Canvas,
      id: canvas.id,
      users: {
        primary: {
          id: canvas.user.id,
          firstName: canvas.user.firstname,
          username: canvas.user.username,
          photo: canvas.user.profileImg },
      },
      imagePath: `${env.host}/api/canvas/image/${canvas.imagePath}`,
      description: canvas.description,
      stars: canvas.stars,
      starred: (reactCount > 0 ? true : false), // Check canvas activity
      utcTime: +canvas.utc,
    };

    res.send(contentCard);

  } else {

    next({ content: [{ detail: 'Canvas not found' }], status: 404 });

  }

});

export default router;
