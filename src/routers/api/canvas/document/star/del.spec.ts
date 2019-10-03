import supertest from 'supertest';
import express from 'express';
import del from './del';
import { httpErrorMiddleware, canvasReactmanager } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';

describe('DELETE canvas/:id/star', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id/star', del);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    // Star the canvas //
    await canvasReactmanager('add', canvas.id, userInfo.user.id);

    await supertest(app)
      .delete(`/${canvas.id}/star`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Expect the canvas star stats to equal 0 //
    await canvas.reload();
    expect(canvas.stars).toEqual(0);

  });

  it('should fail without auth token', async () => {

    const res = await supertest(app)
      .delete('/2452452542/star');

    expect(res.status).toEqual(401);

  });

  it('should fail if canvas is missing', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete('/2452452542/star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(404);

  });

  it('should not affect stars if wrong canvas inputted', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    // Star the canvas //
    await canvasReactmanager('add', canvas.id, userInfo.user.id);

    await supertest(app)
      .delete('/1334613461346/star')
      .set('Authorization', `Bearer ${userInfo.token}`);

    await canvas.reload();
    expect(canvas.stars).toEqual(1);

  });

});
