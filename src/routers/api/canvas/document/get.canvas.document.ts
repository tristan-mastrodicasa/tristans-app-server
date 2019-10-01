import { Router } from 'express';

import { Canvas } from 'database/entities/canvas.entity';
import { ContentCard, EContentType } from 'shared/models';

import env from 'conf/env';

const router = Router({ mergeParams: true });

router.get('/', (req, res, next) => {

  Canvas.findOne(req.params.id).then(
    (canvas: Canvas) => {

      if (canvas) {

        const contentCard: ContentCard = {
          type: EContentType.Canvas,
          id: canvas.id,
          users: {
            primary: { id: 1, firstName: 'Tristan', username: 'ghoststeam217', photo: '/assets/svg-img/default-profile-picture.svg' },
          },
          imagePath: `${env.host}/api/canvas/image/${canvas.imagePath}`,
          description: canvas.description,
          stars: canvas.stars,
          starred: false, // Check canvas activity
          utcTime: +canvas.utc,
        };

        res.send(contentCard);

      } else {

        console.log('error');
        next({ content: [{ detail: 'Canvas not found' }], status: 404 });

      }

    },
  );

});

export { router as getCanvasDocument };
