import supertest from 'supertest';
import express from 'express';
import get from './get';
import { Canvas } from 'database/entities/canvas.entity';
import { User } from 'database/entities/user.entity';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { httpErrorMiddleware, canvasReactManager } from 'shared/helpers';

describe('GET canvas/:id', () => {

  let app: express.Express;
  let canvas: Canvas;
  let userInfo: { token: string, user: User };

  beforeAll(async () => {
    app = express();
    app.use('/:id', get);
    app.use(httpErrorMiddleware);

    userInfo = await getNewAuthorizedUser();
    canvas = await getPhonyCanvas(userInfo.user.id);
  });

  it('should work with ideal inputs and auth token', async () => {
    const res = await supertest(app)
      .get(`/${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body.type).toEqual('canvas');
  });

  it('should work with ideal inputs and no auth token', async () => {
    const res = await supertest(app)
      .get(`/${canvas.id}`);

    expect(res.body.type).toEqual('canvas');
  });

  it('should notifiy the user when they star that content', async () => {

    // Star the canvas //
    await canvasReactManager('add', canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .get(`/${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body.starred).toEqual(true);

  });

  it('should fail when id doesn\'t exist', async () => {
    const res = await supertest(app)
      .get('/1323423423');

    expect(res.status).toEqual(404);
    expect(res.body.errors[0]).toBeDefined();
  });

});
