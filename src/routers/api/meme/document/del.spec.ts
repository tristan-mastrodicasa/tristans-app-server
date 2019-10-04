import supertest from 'supertest';
import express from 'express';
import del from './del';
import { Meme } from 'database/entities/meme.entity';
import { httpErrorMiddleware } from 'shared/helpers';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { getPhonyMeme } from 'spec-helpers/phony-meme-setup';

describe('DELETE meme/:id', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use('/:id', del);
    app.use(httpErrorMiddleware);
  });

  it('should work with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .delete(`/${meme.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    // Should delete meme //
    expect(res.status).toBe(204);
    expect(await Meme.findOne(meme.id)).toBeUndefined();

    /** @todo Check that meme reacts are deleted */
  });

  it('should fail without auth token', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);

    const res = await supertest(app)
      .delete(`/${meme.id}`);

    expect(res.status).toBe(401);
  });

  it('should fail if the user id of the auth token mismatches the meme', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const meme = await getPhonyMeme(canvas.id, userInfo.user.id);
    const newUser = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete(`/${meme.id}`)
      .set('Authorization', `Bearer ${newUser.token}`);

    expect(res.status).toBe(401);
  });

  it('should fail if meme does not exist', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .delete('/12412412412')
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();

  });

});
