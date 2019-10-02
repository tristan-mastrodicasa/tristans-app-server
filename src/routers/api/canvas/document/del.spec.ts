import supertest from 'supertest';
import express from 'express';
import del from './del';

import { User } from 'database/entities/user.entity';

import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';

describe('DELETE canvas/:id', () => {

  let app: express.Express;
  let canvasId: number;
  let userInfo: { token: string, userid: number };

  beforeAll(async () => {
    userInfo = await getNewAuthorizedUser();
    app = express();
    app.use('/:id', del);
    app.use(httpErrorMiddleware);
  });

  // Remove the test authorized user //
  afterAll(async () => {
    const user = await User.findOne(userInfo.userid);
    await user.remove(); // Deletes all associated canvases too
  });

  it('should work with ideal inputs', async () => {
    canvasId = await getPhonyCanvas(userInfo.userid);

    const res = await supertest(app)
      .delete(`/${canvasId}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toBe(204);
  });

  it('should fail without auth token', async () => {
    canvasId = await getPhonyCanvas(userInfo.userid);

    const res = await supertest(app)
      .delete(`/${canvasId}`);

    expect(res.status).toBe(401);
  });

  it('should fail if the user id of the auth token mismatches the canvases', async () => {
    canvasId = await getPhonyCanvas(userInfo.userid);
    const newUser = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete(`/${canvasId}`)
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(res.status).toBe(401);

    // Remove new user //
    const user = await User.findOne(newUser.userid);
    await user.remove();
  });

  it('should fail canvas does not exist', async () => {

    const res = await supertest(app)
      .delete('/12412412412')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();

  });

});
