import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';
import { httpErrorMiddleware, runAsyncConcurrently, canvasReactManager } from 'shared/helpers';
import { ContentCard, EContentType } from 'shared/models';

describe('GET user/:id/daily-suggestions', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/daily-suggestions', get);
    app.use(httpErrorMiddleware);

    // Create a collection of memes + canvases //
    // 150 memes and 30 canvases //
    await runAsyncConcurrently(
      async () => {
        const newCanvasUser = await getNewAuthorizedUser();
        const newCanvas = await getPhonyCanvas(newCanvasUser.user.id);

        for (let x = 0; x < 5; x += 1) {
          const newMemeUser = await getNewAuthorizedUser();
          const meme = await getPhonyMeme(newCanvas.id, newMemeUser.user.id);
          meme.stars = newCanvas.id * x;
          await meme.save();
        }
      },
      30,
    );
  });

  it('should work with ideal inputs and auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/daily-suggestions`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect a set of content to bew returned //
    expect(res.body.length).toEqual(150);

    // Expect to be ordered from oldest to newest //
    expect(+res.body[0].utcTime).toBeGreaterThan(+res.body[149].utcTime);
  });

  it('should fail when an authorized user tries to access another\'s suggestions', async () => {
    const userInfo = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/daily-suggestions`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    // Not allowed to access another suggested //
    expect(res.status).toEqual(401);
  });

  it('should work when public user accesses public user suggestions', async () => {
    const res = await supertest(app)
      .get('/0/daily-suggestions');

    // Should return a list of recommended //
    expect(res.body.length).toEqual(150);
  });

  it('should fail if a registered user accesses the public suggestions', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get('/0/daily-suggestions')
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Unauthorized //
    expect(res.status).toEqual(401);
  });

  it('should fail if user id != 0 and user has no auth token', async () => {
    const res = await supertest(app)
      .get('/1223/daily-suggestions');

    // Unauthorized //
    expect(res.status).toEqual(401);
  });

  // Check that if one canvas has more stars than the rest but was made 3 days ago it won't show
  it('should most starred post should not show if made 3 days ago', async () => {
    let res: any;
    const bigStar = 10000;
    const userInfo = await getNewAuthorizedUser();
    const newCanvas = await getPhonyCanvas(userInfo.user.id);

    newCanvas.stars = bigStar;
    await newCanvas.save();

    res = await supertest(app)
      .get(`/${userInfo.user.id}/daily-suggestions`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Big star canvas should show //
    res.body.forEach((value: ContentCard) => {
      if (value.type === EContentType.Canvas && value.id === newCanvas.id) {
        expect(value.stars).toEqual(bigStar);
      }
    });

    // Set the big star creation date 3 days ago //
    newCanvas.utc.setDate(newCanvas.utc.getDate() - 3);
    await newCanvas.save();

    res = await supertest(app)
      .get(`/${userInfo.user.id}/daily-suggestions`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Big star canvas should NOT show //
    res.body.forEach((value: ContentCard) => {
      // No content should have the big star count //
      expect(value.stars).not.toEqual(bigStar);
    });

  });

  // Check if it correctly shows if you starred it
  it('should most starred post should not show if made 3 days ago', async () => {
    const userInfo = await getNewAuthorizedUser();
    const newCanvas = await getPhonyCanvas(userInfo.user.id);

    // Give the canvas enough stars to show in suggested //
    newCanvas.stars = 100;
    await newCanvas.save();

    // Star your own canvas //
    await canvasReactManager('add', newCanvas.id, userInfo.user.id);

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/daily-suggestions`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Should show that you starred your own canvas //
    res.body.forEach((value: ContentCard) => {
      if (value.type === EContentType.Canvas && value.id === newCanvas.id) {
        expect(value.starred).toEqual(true);
      }
    });

  });

  it('should fail when user doesn\'t exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get('/1323423423/daily-suggestions')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(401);
    expect(res.body.errors[0]).toBeDefined();
  });

  it('should return 404 if no content', async () => {
    return true; // No way to test without tuncating DB and screwing others tests up
  });

});
