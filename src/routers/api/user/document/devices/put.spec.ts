import supertest from 'supertest';
import express from 'express';
import put from './put';
import crypto from 'crypto';
import { User } from 'database/entities/user.entity';
import { MobileRelations } from 'database/entities/mobile-relations.entity';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';
import { IMobileDevice } from 'shared/models';

describe('PUT user/:id/devices', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/:id/devices', put);
    app.use(httpErrorMiddleware);
  });

  it('should work when changing device relation with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData: IMobileDevice = {
      deviceId: crypto.randomBytes(10).toString('hex'),
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    // Device should change //
    expect(res.status).toEqual(200);

    const user = await User.findOne(userInfo.user.id, { relations: ['mobileDevice'] });

    // Check changes have been made //
    expect(user.mobileDevice.deviceId).toEqual(updateData.deviceId);
  });

  it('should work when changing device relation with ideal inputs for the second time', async () => {
    const userInfo = await getNewAuthorizedUser();

    let updateData: IMobileDevice;

    updateData = {
      deviceId: crypto.randomBytes(10).toString('hex'),
    };

    await supertest(app)
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    updateData = {
      deviceId: crypto.randomBytes(10).toString('hex'),
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    const user = await User.findOne(userInfo.user.id, { relations: ['mobileDevice'] });

    expect(res.status).toEqual(200);
    expect(user.mobileDevice.deviceId).toEqual(updateData.deviceId);

    // Should still be only 1 record //
    const count = await MobileRelations.count({ where: { user } });
    expect(count).toEqual(1);
  });

  it('should not let two users have the same device id (unique)', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const updateData: IMobileDevice = {
      deviceId: crypto.randomBytes(10).toString('hex'),
    };

    // First users updates their device //
    const res = await supertest(app)
      .put(`/${userInfo1.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo1.token}`)
      .send(updateData);

    expect(res.status).toEqual(200);

    // Second user should update their device with the same data and fail //
    const res2 = await supertest(app)
      .put(`/${userInfo2.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo2.token}`)
      .send(updateData);

    expect(res2.status).toEqual(400);
  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData: IMobileDevice = {
      deviceId: crypto.randomBytes(10).toString('hex'),
    };

    const res = await supertest(app)
      .put('/13123123123123123/devices')
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(401);
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/devices`);

    expect(res.status).toEqual(401);
  });

  it('should fail if another user tries to edit your settings', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo1.user.id}/devices`)
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
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    // Malformed body //
    expect(res.status).toEqual(400);
  });

  it('should fail if no body is sent', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // No body == malformed request //
    expect(res.status).toEqual(400);
  });

  it('should fail if entered data types are wrong', async () => {
    const userInfo = await getNewAuthorizedUser();

    const updateData = {
      deviceId: true,
    };

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/devices`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .send(updateData);

    expect(res.status).toEqual(400);
  });

});
