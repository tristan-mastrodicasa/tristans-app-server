import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { httpErrorMiddleware, networkManager } from 'shared/helpers';
import { UserItem } from 'shared/models';

describe('GET user/:id/followers', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/followers', get);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs and auth token', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();
    const userInfo3 = await getNewAuthorizedUser();

    // Make the third user create 2 new canvases //
    await getPhonyCanvas(userInfo3.user.id);
    await getPhonyCanvas(userInfo3.user.id);

    // Make the third user create a canvas two days ago //
    const canvas = await getPhonyCanvas(userInfo3.user.id);
    canvas.utc.setDate(canvas.utc.getDate() - 2);
    await canvas.save();

    // Give the second user influence //
    userInfo2.user.statistics.influence += 109;
    await userInfo2.user.statistics.save();

    // Give the first user two followers //
    await networkManager('follow', userInfo2.user.id, userInfo1.user.id);
    await networkManager('follow', userInfo3.user.id, userInfo1.user.id);

    const res = await supertest(app)
      .get(`/${userInfo1.user.id}/followers`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    // Both followers should return //
    expect(res.body.length).toEqual(2);

    res.body.forEach((user: UserItem) => {
      // One follower should have influence //
      if (user.id === userInfo2.user.id) expect(user.influence).toEqual(userInfo2.user.statistics.influence);

      // One follower should have only two active canvases //
      if (user.id === userInfo3.user.id) expect(user.activeCanvases).toEqual(2);
    });
  });

  it('should fail without an auth token', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/followers`);

    expect(res.status).toEqual(401);
  });

  it('should fail if you attempt to get someone elses follower list', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo2.user.id}/followers`)
      .set('Authorization', `Bearer ${userInfo1.token}`);

    expect(res.status).toEqual(401);

  });

  it('should fail when user id doesn\'t exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    // Delete user //
    await userInfo.user.remove();

    // Try to get its follower list //
    const res = await supertest(app)
      .get(`/${userInfo.user.id}/followers`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Should break //
    expect(res.status).toEqual(401);
  });

  it('should only return 150 user items', async () => {
    const userInfo = await getNewAuthorizedUser();

    // Add 150 followers to primary user //
    for (let i = 0; i < 155; i += 1) {
      const newUser = await getNewAuthorizedUser();
      await networkManager('follow', newUser.user.id, userInfo.user.id);

      // Every 10 users add a canvas //
      if (i % 10 === 0) {
        await getPhonyCanvas(newUser.user.id);

        // Every three users that get a canvas get 2 canvases //
        if (i % 30 === 0) {
          await getPhonyCanvas(newUser.user.id);
        }
      }
    }

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/followers`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Should return MAX 150 users //
    expect(res.body.length).toEqual(150);

    // Users should be ordered by those with active canvases //
    expect(res.body[0].activeCanvases).toEqual(2);
    expect(res.body[10].activeCanvases).toEqual(1);
    expect(res.body[100].activeCanvases).toEqual(0);
  });

  it('should return 404 when no followers exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get(`/${userInfo.user.id}/followers`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Should return none found //
    expect(res.status).toEqual(404);
  });

});
