import supertest from 'supertest';
import express from 'express';
import post from './post';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { UserNetwork } from 'database/entities/user-network.entity';

describe('POST user/:id/follow', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/follow', post);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    await supertest(app)
      .post(`/${userInfo1.user.id}/follow`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    // Did the record correctly enter //
    const networkRecord = await UserNetwork.findOne({ user: userInfo1.user, follower: userInfo2.user }, { relations: ['user', 'follower'] });
    expect(networkRecord.user.id).toEqual(userInfo1.user.id);
    expect(networkRecord.follower.id).toEqual(userInfo2.user.id);
  });

  it('should fail without authorization', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post(`/${userInfo.user.id}/follow`);

    expect(res.status).toEqual(401);
  });

  it('should fail if user does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post('/31513451345145/follow')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body).toBeDefined();
    expect(res.status).toEqual(404);
  });

  it('should not add more than one network record (can\'t follow twice)', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    await supertest(app)
      .post(`/${userInfo1.user.id}/follow`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    await supertest(app)
      .post(`/${userInfo1.user.id}/follow`)
      .set('Authorization', `Bearer ${userInfo2.token}`);

    // Did the record correctly enter //
    const networkRecord = await UserNetwork.find({ user: userInfo1.user, follower: userInfo2.user });
    expect(networkRecord.length).toEqual(1);
  });

});
