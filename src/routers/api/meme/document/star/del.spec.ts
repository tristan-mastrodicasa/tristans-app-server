import supertest from 'supertest';
import express from 'express';
import del from './del';
import { httpErrorMiddleware, memeReactManager } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';

describe('DELETE meme/:id/star', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/star', del);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    // Star the meme //
    await memeReactManager('add', meme.id, userInfo.user.id);

    await supertest(app)
      .delete(`/${meme.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the meme star stats to equal 0 //
    await meme.reload();
    expect(meme.stars).toEqual(0);

  });

  it('should fail without auth token', async () => {

    const res = await supertest(app)
      .delete('/2452452542/star');

    expect(res.status).toEqual(401);

  });

  it('should fail if meme is missing', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete('/2452452542/star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(404);

  });

  it('should not affect stars if wrong meme inputted', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    // Star the meme //
    await memeReactManager('add', meme.id, userInfo.user.id);

    await supertest(app)
      .delete('/1334613461346/star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    await meme.reload();
    expect(meme.stars).toEqual(1);

  });

});
