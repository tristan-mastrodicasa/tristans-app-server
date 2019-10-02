import supertest from 'supertest';
import express from 'express';
import post from './post';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { EInfluence } from 'shared/models';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';

describe('POST canvas/:id/add-star', () => {

  let app: express.Express;
  let canvasId: number;
  let userInfo: { token: string, userid: number };

  beforeAll(async () => {
    userInfo = await getNewAuthorizedUser();
    app = express();
    app.use('/:id/add-star', post);
    app.use(httpErrorMiddleware);

    canvasId = await getPhonyCanvas(userInfo.userid);
  });

  // Remove the test authorized user //
  afterAll(async () => {
    const user = await User.findOne(userInfo.userid);
    await user.remove(); // Deletes all associated canvases too
  });

  it('should work with ideal inputs', async () => {
    const res = await supertest(app)
      .post(`/${canvasId}/add-star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the canvas star stats to increase //
    const canvas = await Canvas.findOne(canvasId);
    expect(canvas.stars).toBeGreaterThan(0);

    // Expect the canvas owner influence to increase //
    const user = await User.findOne(userInfo.userid, { relations: ['statistics'] });
    expect(user.statistics.influence).toBeGreaterThan(0);

    expect(res.status).toEqual(200);
  });

  it('should fail without authorization', async () => {
    const res = await supertest(app)
      .post(`/${canvasId}/add-star`);

    expect(res.status).toEqual(401);
  });

  it('should fail if canvas does not exist', async () => {
    const res = await supertest(app)
      .post('/31513451345145/add-star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.body).toBeDefined();
    expect(res.status).toEqual(404);
  });

  it('should not add more than one star', async () => {
    await supertest(app)
      .post(`/${canvasId}/add-star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    const res = await supertest(app)
      .post(`/${canvasId}/add-star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the canvas star stats to remain at 1 //
    const canvas = await Canvas.findOne(canvasId);
    expect(canvas.stars).toEqual(1);

    // Expect the canvas owner influence to stay at the influence per star //
    const user = await User.findOne(userInfo.userid, { relations: ['statistics'] });
    expect(user.statistics.influence).toEqual(EInfluence.star);

    expect(res.status).toEqual(200);
  });

});
