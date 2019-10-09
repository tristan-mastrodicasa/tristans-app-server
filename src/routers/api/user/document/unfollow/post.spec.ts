import supertest from 'supertest';
import express from 'express';
import post from './post';
import { httpErrorMiddleware, networkManager } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { UserNetwork } from 'database/entities/user-network.entity';

describe('POST user/:id/unfollow', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/unfollow', post);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    // Get user 1 to follow user 2 //
    await networkManager('follow', userInfo1.user.id, userInfo2.user.id);

    // Unfollow user 2 from user 1's token //
    await supertest(app)
      .post(`/${userInfo2.user.id}/unfollow`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    // User was sucessfully unfollowed //
    const networkRecord = await UserNetwork.find({ user: userInfo2.user, follower: userInfo1.user });
    expect(networkRecord.length).toBe(0);
  });

  it('should fail without authorization', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post(`/${userInfo.user.id}/unfollow`);

    expect(res.status).toEqual(401);
  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post('/31513451345145/unfollow')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body).toBeDefined();
    expect(res.status).toEqual(404);
  });

  it('should not break when unfollowing twice', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    // Get user 1 to follow user 2 //
    await networkManager('follow', userInfo1.user.id, userInfo2.user.id);

    await supertest(app)
      .post(`/${userInfo2.user.id}/unfollow`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    await supertest(app)
      .post(`/${userInfo2.user.id}/unfollow`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    // User was sucessfully unfollowed //
    const networkRecord = await UserNetwork.find({ user: userInfo2.user, follower: userInfo1.user });
    expect(networkRecord.length).toBe(0);
  });

});
