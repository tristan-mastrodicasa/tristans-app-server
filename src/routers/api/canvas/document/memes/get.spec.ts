import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';
import { httpErrorMiddleware, memeReactManager } from 'shared/helpers';

describe('GET canvas/:id/memes', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/memes', get);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs and auth token', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    // Create a single meme //
    await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .get(`/${canvas.id}/memes`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body.length).toEqual(1);
  });

  it('should work with ideal inputs and no auth token', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    // Create a single meme //
    await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .get(`/${canvas.id}/memes`);

    expect(res.body.length).toEqual(1);
  });

  it('should display a list of memes up to 75 sorted by stars', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    // Create a lot of memes //
    for (let i = 0; i < 80; i += 1) {

      const uniqueUser = await getNewAuthorizedUser();

      // Like the fifth meme //
      if (i === 5) {
        const meme = await getPhonyMeme(canvas.id, uniqueUser.user.id);
        await memeReactManager('add', meme.id, uniqueUser.user.id);
        continue;
      }

      await getPhonyMeme(canvas.id, uniqueUser.user.id);
    }

    const res = await supertest(app)
      .get(`/${canvas.id}/memes`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // The first meme should have 1 star (ordered by highest score)//
    expect(res.body[0].stars).toEqual(1);
    expect(res.body[1].stars).toEqual(0);

    // A max 75 memes sould be returned //
    expect(res.body.length).toEqual(75);

  });

  it('should fail when canvas doesn\'t exist', async () => {
    const res = await supertest(app)
      .get('/1323423423/memes');

    expect(res.status).toEqual(404);
    expect(res.body.errors[0]).toBeDefined();
  });

});
