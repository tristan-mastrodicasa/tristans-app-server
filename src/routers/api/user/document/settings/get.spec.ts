import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';

describe('GET user/:id/settings', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/settings', get);
    app.use(httpErrorMiddleware);
  });

  it('should work when getting own settings', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Settings shoud return //
    expect(res.status).toEqual(200);
    expect(res.body.notifications).toBeDefined();
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/settings`);

    expect(res.status).toEqual(401);
  });

  it('should fail if another user tries to access your settings', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo1.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    expect(res.status).toEqual(401);
  });

});
