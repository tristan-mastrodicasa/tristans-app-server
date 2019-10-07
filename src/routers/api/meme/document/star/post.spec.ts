import supertest from 'supertest';
import express from 'express';
import post from './post';
import { EInfluence } from 'shared/models';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';

describe('POST meme/:id/star', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/star', post);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .post(`/${meme.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the meme star stats to increase //
    await meme.reload();
    expect(meme.stars).toBeGreaterThan(0);

    // Expect the meme owner influence to increase //
    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.influence).toBeGreaterThan(0);

    expect(res.status).toEqual(200);
  });

  it('should fail without authorization', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .post(`/${meme.id}/star`);

    expect(res.status).toEqual(401);
  });

  it('should fail if meme does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post('/31513451345145/star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body).toBeDefined();
    expect(res.status).toEqual(404);
  });

  it('should not add more than one star', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    await supertest(app)
      .post(`/${meme.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    const res = await supertest(app)
      .post(`/${meme.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the meme star stats to remain at 1 //
    await meme.reload();
    expect(meme.stars).toEqual(1);

    // Expect the meme owner influence to stay at the influence per star //
    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.influence).toEqual(EInfluence.star);

    expect(res.status).toEqual(200);
  });

});
