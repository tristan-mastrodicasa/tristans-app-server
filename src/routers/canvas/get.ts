import { Router } from 'express';
import { Meme } from 'database/entities/meme.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { buildCanvasCard, buildMemeWithHostCard } from 'shared/helpers';
import { ContentCard } from 'shared/models';

const router = Router();

/**
 * Return the human readable difference in time between two utc timestamps
 * Code from -> https://stackoverflow.com/a/6109105/3867288
 * @param  current  Start utc time (now)
 * @param  previous Last utc time (utc in the past)
 * @return          A string describing the time passed in human readable format
 */
function timeDifference(current: number, previous: number): string {

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return 'Just Now';
  }  if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} minutes ago`;
  }  if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} hours ago`;
  }  if (elapsed < msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} days ago`;
  }  if (elapsed < msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} months ago`;
  }

  return `${Math.round(elapsed / msPerYear)} years ago`;

}

router.get('/:id', async (req, res, _next) => {

  const canvas = await Canvas.findOne(req.params.id, { relations: ['user'] });

  if (canvas) {

    const contentCard = await buildCanvasCard(canvas, null);
    const record = { canvas: contentCard, utcFormatted: timeDifference(Date.now(), +canvas.utc) };

    // Container for returned memes //
    const memeList: { meme: ContentCard, utcFormatted: string}[] = [];

    const memes = await Meme.find({
      relations: ['user', 'canvas', 'canvas.user'],
      where: {
        canvas,
      },
      order: {
        stars: 'DESC',
      },
      take: 3,
    });

    for (const meme of memes) {

      const contentCard = await buildMemeWithHostCard(meme, null);

      memeList.push({
        meme: contentCard,
        utcFormatted: timeDifference(Date.now(), +meme.utc),
      });

    }

    return res.render('pages/canvas-preview', { memeList, canvash: record });

  }

  return res.status(404).send();

});

export default router;
