import supertest from 'supertest';
import express from 'express';
import del from './del';
import { User } from 'database/entities/user.entity';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';

describe('DELETE canvas/:id', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id', del);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .delete(`/${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toBe(204);
  });

  it('should fail without auth token', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .delete(`/${canvas.id}`);

    expect(res.status).toBe(401);
  });

  it('should fail if the user id of the auth token mismatches the canvases', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const newUser = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete(`/${canvas.id}`)
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(res.status).toBe(401);

    // Remove new user //
    const user = await User.findOne(newUser.user.id);
    await user.remove();
  });

  it('should fail canvas does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete('/12412412412')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();

  });

});
