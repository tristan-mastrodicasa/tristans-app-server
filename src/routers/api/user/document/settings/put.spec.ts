import supertest from 'supertest';
import express from 'express';
import put from './put';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';
import { IUserSettings } from 'shared/models';

describe('PUT user/:id/settings', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/:id/settings', put);
    app.use(httpErrorMiddleware);
  });

  it('should work when editing own settings', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData: IUserSettings = {
      notifications: {
        canvasInvites: false,
        subscriptionUploadedACanvas: false,
        userMemedMyCanvas: true,
        pointsUpdate: true,
        newFollower: false,
      },
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    // Settings should change //
    expect(res.status).toEqual(200);

    await userInfo.user.settings.reload();

    // Check changes have been made //
    expect(userInfo.user.settings.nCanvasInvites).toEqual(false);
    expect(userInfo.user.settings.nSubscriptionUploadedACanvas).toEqual(false);
    expect(userInfo.user.settings.nNewFollowers).toEqual(false);
  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData: IUserSettings = {
      notifications: {
        canvasInvites: false,
        subscriptionUploadedACanvas: false,
        userMemedMyCanvas: true,
        pointsUpdate: true,
        newFollower: true,
      },
    };

    const res = await supertest(app)
      .put('/13123123123123123/settings')
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(401);
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`);

    expect(res.status).toEqual(401);
  });

  it('should fail if another user tries to edit your settings', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo1.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    expect(res.status).toEqual(401);
  });

  it('should fail if settings sent are malformed', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      woops: {
        wrongFormat: true,
      },
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    // Malformed body //
    expect(res.status).toEqual(400);
  });

  it('should fail if no body is sent', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // No body == malformed request //
    expect(res.status).toEqual(400);
  });

  it('should fail if entered data types are wrong', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      notifications: {
        canvasInvites: false,
        subscriptionUploadedACanvas: 'false',
        userMemedMyCanvas: 1,
        pointsUpdate: true,
        newFollower: false,
      },
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(400);
  });

  it('should fail if null is entered on non-nullable fields', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      notifications: {
        canvasInvites: false,
        subscriptionUploadedACanvas: false,
        userMemedMyCanvas: true,
        pointsUpdate: null,
        newFollower: null,
      },
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/settings`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(400);
  });

});
