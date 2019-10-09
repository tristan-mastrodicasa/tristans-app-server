import supertest from 'supertest';
import express from 'express';
import put from './put';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware } from 'shared/helpers';

describe('PUT user/:id/image', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/image', put);
    app.use(httpErrorMiddleware);
  });

  it('should work when changing own image', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('user_image', 'src/spec-helpers/images/medium-image.png');

    // Settings should change //
    expect(res.status).toEqual(200);

    const oldImg = userInfo.user.profileImg;

    await userInfo.user.reload();

    // Check changes have been made //
    expect(userInfo.user.profileImg).not.toEqual(oldImg);
    expect(userInfo.user.profileImgMimeType).toEqual('image/png');
  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put('/13123123123123123/image')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(401);
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/image`);

    expect(res.status).toEqual(401);
  });

  it('should fail if another user tries to edit your image', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo1.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    expect(res.status).toEqual(401);
  });

  it('should fail if image too big', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('user_image', 'src/spec-helpers/images/large-image.jpg');

    // image too big //
    expect(res.status).toEqual(400);
  });

  it('should fail if no image is sent', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // No body == malformed request //
    expect(res.status).toEqual(400);
  });

  it('should fail if wrong file type', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .put(`/${userInfo.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('user_image', 'src/spec-helpers/images/moving-image.gif');

    // wrong file type //
    expect(res.status).toEqual(400);
  });

  it('should fail after > 15 requests to change profile picture (rate limited)', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();
    let res: any;

    for (let i = 0; i < 16; i += 1) {
      res = await supertest(app)
        .put(`/${userInfo1.user.id}/image`)
        .set('Authorization', `Bearer ${userInfo1.token}`);
        // .attach('user_image', 'src/spec-helpers/images/medium-image.jpg');
    }

    // Rate limited //
    expect(res.status).toEqual(429);

    res = await supertest(app)
      .put(`/${userInfo2.user.id}/image`)
      .set('Authorization', `Bearer ${userInfo2.token}`)
      .attach('user_image', 'src/spec-helpers/images/medium-image.jpg');

    // Should not be Rate limited for user 2 //
    expect(res.status).toEqual(200);
  });

});
