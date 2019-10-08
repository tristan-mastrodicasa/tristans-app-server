import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';

describe('GET user/:id', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id', get);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs and auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Get own profile //
    expect(res.body.id).toEqual(userInfo.user.id);
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}`);

    expect(res.status).toEqual(401);
  });

  it('should get a profile other than your own', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo2.user.id}`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    expect(res.body.id).toEqual(userInfo2.user.id);

  });

  it('should fail when user id doesn\'t exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get('/1323423423')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(404);
    expect(res.body.errors[0]).toBeDefined();
  });

});
