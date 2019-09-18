import { Router } from 'express';

import { Canvas } from 'database/entities/canvas.entity';
import { ContentCard, EContentType } from 'shared/models';

const router = Router();

router.get('/:id', (req, res, next) => {

  console.log(req.params);

  Canvas.findOne(req.params.id).then(
    (canvas: Canvas) => {

      if (canvas) {

        const contentCard: ContentCard = {
          type: EContentType.Canvas,
          id: canvas.id,
          users: {
            primary: { id: 1, firstName: 'Tristan', username: 'ghoststeam217', photo: '/assets/svg-img/default-profile-picture.svg' },
          },
          imagePath: canvas.imagePath,
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

export default router;
