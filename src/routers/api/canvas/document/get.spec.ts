import supertest from 'supertest';
import express from 'express';

import get from './get';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { httpErrorMiddleware } from 'shared/helpers';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';

describe('GET canvas/:id', () => {

  let app: express.Express;
  let canvasId: number;
  let userInfo: { token: string, userid: number };

  beforeAll(async () => {
    userInfo = await getNewAuthorizedUser();
    app = express();
    app.use('/:id', get);
    app.use(httpErrorMiddleware);

    canvasId = await getPhonyCanvas(userInfo.userid);
  });

  // Remove the test authorized user //
  afterAll(async () => {
    const user = await User.findOne(userInfo.userid);
    await user.remove(); // Deletes all associated canvases too
  });

  it('should work with ideal inputs and auth token', async () => {
    const res = await supertest(app)
      .get(`/${canvasId}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body.type).toEqual('canvas');
  });

  it('should work with ideal inputs and no auth token', async () => {
    const res = await supertest(app)
      .get(`/${canvasId}`);

    expect(res.body.type).toEqual('canvas');
  });

  it('should notifiy the user when they star that content', async () => {

    // Simulate starring the canvas //
    const user = await User.findOne(userInfo.userid);
    const canvas = await Canvas.findOne(canvasId);

    const reactsRecord = new CanvasReacts();
    reactsRecord.canvas = canvas;
    reactsRecord.user = user;
    await reactsRecord.save();

    const res = await supertest(app)
      .get(`/${canvasId}`)
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
