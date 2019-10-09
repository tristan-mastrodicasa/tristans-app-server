import supertest from 'supertest';
import express from 'express';
import put from './put';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';

describe('PUT user/:id', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/:id', put);
    app.use(httpErrorMiddleware);
  });

  it('should work when editing own settings', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      firstName: 'Chris',
      username: 'kooooool217',
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(200);

    // User should be updated //
    await userInfo.user.reload();
    expect(userInfo.user.username).toEqual(updateData.username);
    expect(userInfo.user.firstname).toEqual(updateData.firstName);

  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      firstName: 'Chris',
      username: 'kooooool217',
    };

    const res = await supertest(app)
      .put('/13123123123123123')
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(401);
  });

  it('should fail if username is already taken', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const updateData = {
      firstName: userInfo2.user.firstname,
      username: userInfo2.user.username,
    };

    const res = await supertest(app)
      .put(`/${userInfo1.user.id}`)
      .set('Authorization', `Bearer ${userInfo1.token}`)
      .send(updateData);

    expect(res.status).toEqual(400);
  });

  // it should fail if username is already taken //

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`);

    expect(res.status).toEqual(401);
  });

  it('should fail if another user tries to edit your profile', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo1.user.id}`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    expect(res.status).toEqual(401);
  });

  it('should fail if updated profile options are malformed', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      woops: {
        wrongFormat: true,
      },
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    // Malformed body //
    expect(res.status).toEqual(400);
  });

  it('should fail if no body is sent', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // No body == malformed request //
    expect(res.status).toEqual(400);
  });

  it('should fail if entered data types are wrong', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      firstName: false,
      username: 17,
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(400);
  });

  it('should fail if validation fails', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      firstName: 'as'.repeat(40),
      username: '$',
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.body.errors.length).toBeGreaterThan(1);
    expect(res.status).toEqual(400);
  });

});
