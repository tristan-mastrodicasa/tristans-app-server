import supertest from 'supertest';
import express from 'express';
import post from './post';
import { EInfluence } from 'shared/models';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';

describe('POST canvas/:id/star', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/star', post);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .post(`/${canvas.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the canvas star stats to increase //
    await canvas.reload();
    expect(canvas.stars).toBeGreaterThan(0);

    // Expect the canvas owner influence to increase //
    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.influence).toBeGreaterThan(0);

    expect(res.status).toEqual(200);
  });

  it('should fail without authorization', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .post(`/${canvas.id}/star`);

    expect(res.status).toEqual(401);
  });

  it('should fail if canvas does not exist', async () => {
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

    await supertest(app)
      .post(`/${canvas.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    const res = await supertest(app)
      .post(`/${canvas.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the canvas star stats to remain at 1 //
    await canvas.reload();
    expect(canvas.stars).toEqual(1);

    // Expect the canvas owner influence to stay at the influence per star //
    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.influence).toEqual(EInfluence.star);

    expect(res.status).toEqual(200);
  });

});
