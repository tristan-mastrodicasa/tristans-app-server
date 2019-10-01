import supertest from 'supertest';
import express from 'express';
import crypto from 'crypto';
import router from './';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { httpErrorMiddleware, createNewCanvas } from 'shared/helpers';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { EVisibility } from 'shared/models';

describe('GET canvases/:id', () => {

  let app: express.Express;
  let canvasId: number;
  let userInfo: { token: string, userid: number };

  beforeAll(async () => {
    userInfo = await getNewAuthorizedUser();
    app = express();
    app.use(router);
    app.use(httpErrorMiddleware);

    // Generate a phony canvas to get //
    const canvas = new Canvas();
    canvas.imagePath = 'default_canvas.jpg';
    canvas.mimetype = 'image/jpeg';
    canvas.visibility = EVisibility.public; // Only public to start
    canvas.uniqueKey = crypto.randomBytes(32).toString('hex');

    const canvasRecord = await createNewCanvas(canvas, userInfo.userid);
    canvasId = canvasRecord.id;
  });

  // Remove the test authorized user //
  afterAll(async () => {
    const user = await User.findOne(userInfo.userid);
    await user.remove();
  });

  it('should work with ideal inputs', async () => {

    const res = await supertest(app)
      .get(`/${canvasId}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    console.log(res.body);
  });

});
