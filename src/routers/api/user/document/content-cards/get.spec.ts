import supertest from 'supertest';
import express from 'express';
import get from './get';
import { User } from 'database/entities/user.entity';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';
import { httpErrorMiddleware, canvasReactManager } from 'shared/helpers';
import { ContentCard } from 'shared/models';

describe('GET user/:id/content-cards', () => {

  let app: express.Express;
  let primaryUser: { token: string; user: User };

  beforeAll(async () => {
    app = express();
    app.use('/:id/content-cards', get);
    app.use(httpErrorMiddleware);

    // Generate an ecosystem of users, memes and canvases //

    // You //
    primaryUser = await getNewAuthorizedUser();

    // Other users //
    const secondUser = await getNewAuthorizedUser();
    const thirdUser = await getNewAuthorizedUser();

    // You and second user makes canvases //
    const primaryUserCanvas = await getPhonyCanvas(primaryUser.user.id);
    const secondUserCanvas = await getPhonyCanvas(secondUser.user.id);

    // You and user 3 meme user 2's canvas //
    await getPhonyMeme(secondUserCanvas.id, primaryUser.user.id);
    await getPhonyMeme(secondUserCanvas.id, thirdUser.user.id);

    // You react your own canvas because you are a narcassist //
    await canvasReactManager('add', primaryUserCanvas.id, primaryUser.user.id);

    // You now have 1 canvas, 1 meme and a star on your canvas //
    await primaryUser.user.reload();
  });

  it('should work with ideal inputs and auth token', async () => {
    const res = await supertest(app)
      .get(`/${primaryUser.user.id}/content-cards`)
      .set('Authorization', `Bearer ${primaryUser.token}`);

    // All content cards are returned //
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    // Make sure that the one with one star is marked as starred (you starred it)
    res.body.forEach((value: ContentCard) => {
      if (value.stars) expect(value.starred).toEqual(true);
    });

  });

  it('should only ever return 100 cards', async () => {
    const userInfo = await getNewAuthorizedUser();

    for (let i = 0; i < 105; i += 1) {
      await getPhonyCanvas(userInfo.user.id);
    }

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/content-cards`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Only 100 are returned //
    expect(res.body.length).toEqual(100);

    // Should be a positive difference (newest come first) //
    expect(res.body[0].utcTime - res.body[49].utcTime).toBeGreaterThanOrEqual(0);
  });

  it('should fail with no auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/content-cards`);

    expect(res.status).toEqual(401);
  });

  it('should fail when user doesn\'t exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get('/1323423423/content-cards')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(404);
    expect(res.body.errors[0]).toBeDefined();
  });

  it('should return 404 if no content', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/content-cards`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(404);
    expect(res.body.errors[0]).toBeDefined();
  });

});
