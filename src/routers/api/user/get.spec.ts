import supertest from 'supertest';
import express from 'express';
import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import {
  httpErrorMiddleware,
  runAsyncConcurrently,
  networkManager,
} from 'shared/helpers';
import { IUserItem } from 'shared/models';

describe('GET user', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/user', get);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs and auth token', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    userInfo1.user.username = 'kittykat3';
    userInfo1.user.firstName = 'Chrisbbb';
    await userInfo1.user.save();

    const userInfo2 = await getNewAuthorizedUser();
    userInfo2.user.username = 'kitty';
    userInfo2.user.firstName = 'Chrisbbb';
    userInfo2.user.statistics.influence += 20;
    await userInfo2.user.statistics.save();
    await userInfo2.user.save();

    const userInfo3 = await getNewAuthorizedUser();
    userInfo3.user.username = 'owwwwww';
    userInfo3.user.firstName = 'kittymeow';
    await userInfo3.user.save();

    const userInfo4 = await getNewAuthorizedUser();
    userInfo4.user.username = 'irrelevant';
    userInfo4.user.firstName = 'irrelevant';
    await userInfo4.user.save();

    const res = await supertest(app)
      .get('/user')
      .query({ query: 'kitty' })
      .set('Authorization', `Bearer ${userInfo1.token}`);

    // Return 3 results (searches usernames and firstnames) //
    expect(res.body.length).toEqual(3);

    // Check that the influence is being sent correctly //
    res.body.forEach((userItem: IUserItem) => {
      if (userItem.id === userInfo2.user.id) {
        expect(userItem.influence).toBe(userInfo2.user.statistics.influence);
      }
    });
  });

  it('should work with empty queries', async () => {
    const userInfo = await getNewAuthorizedUser();

    let res: any;

    res = await supertest(app)
      .get('/user')
      .query({ query: '' })
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Return something //
    expect(res.body.length).toBeGreaterThan(0);

    res = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Return something //
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should be ordered by influence when query is empty', async () => {
    const primaryUserInfo = await getNewAuthorizedUser();

    for (let i = 0; i < 10; i += 1) {
      const userInfo = await getNewAuthorizedUser();
      userInfo.user.statistics.influence += 30 * i;
      await userInfo.user.statistics.save();
    }

    const res = await supertest(app)
      .get('/user')
      .query({ query: '' })
      .set('Authorization', `Bearer ${primaryUserInfo.token}`);

    // Return something //
    expect(res.body.length).toBeGreaterThan(0);

    // Should be ordered by influence //
    expect(res.body[0].influence).toBeGreaterThanOrEqual(res.body[1].influence);
    expect(res.body[1].influence).toBeGreaterThanOrEqual(res.body[2].influence);
    expect(res.body[2].influence).toBeGreaterThanOrEqual(res.body[3].influence);
  });

  it('should display that you follow a user', async () => {
    const primaryUserInfo = await getNewAuthorizedUser();

    const secondaryUserInfo = await getNewAuthorizedUser();
    secondaryUserInfo.user.username = 'veryunique12893718923';
    await secondaryUserInfo.user.save();

    await networkManager('follow', primaryUserInfo.user.id, secondaryUserInfo.user.id);

    const res = await supertest(app)
      .get('/user')
      .query({ query: secondaryUserInfo.user.username })
      .set('Authorization', `Bearer ${primaryUserInfo.token}`);

    // Return something //
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].username).toBe(secondaryUserInfo.user.username);

    // Displays the fact you follow this user //
    expect(res.body[0].youAreFollowing).toEqual(true);
  });

  it('should limit to 50 results', async () => {
    const userInfo = await getNewAuthorizedUser();

    // Create > 50 users //
    await runAsyncConcurrently(
      async () => {
        await getNewAuthorizedUser();
      },
      55,
    );

    const res = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Return something //
    expect(res.body.length).toEqual(50);
  });

  it('should be unaffected by sql injection', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .get('/user')
      .query({ query: '\'"&;;' })
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Nothing should be found //
    expect(res.status).toEqual(404);
  });

  it('should fail without an auth token', async () => {
    const res = await supertest(app)
      .get('/user');

    // Unauthorized //
    expect(res.status).toEqual(401);
  });

});
