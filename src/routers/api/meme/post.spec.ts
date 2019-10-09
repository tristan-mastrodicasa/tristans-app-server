import supertest from 'supertest';
import express from 'express';
import post from './post';
import { getNewAuthorizedUser } from 'spec-helpers/authorized-user-setup';
import { getPhonyCanvas } from 'spec-helpers/phony-canvas-setup';
import { httpErrorMiddleware } from 'shared/helpers';
import { Meme } from 'database/entities/meme.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { EInfluence } from 'shared/models';

describe('POST meme', () => {

  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(post);
    app.use(httpErrorMiddleware);
  });

  it('should create a meme with ideal inputs', async () => {
    const userInfo = await getNewAuthorizedUser();
    let canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .post('/')
      .query(`canvasid=${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

    expect(res.status).toBe(201);
    expect(res.body.memeId).toBeDefined();

    // Are the relations set correctly //
    const meme = await Meme.findOne(res.body.memeId, { relations: ['canvas', 'user'] });
    expect(meme.user.id).toEqual(userInfo.user.id); // Correct meme owner
    expect(meme.canvas.id).toEqual(canvas.id); // Correct host canvas

    canvas = await Canvas.findOne(canvas.id, { relations: ['memes'] });
    expect(canvas.memes).toBeDefined(); // Meme linked to the canvas

    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.contentNum).toBeGreaterThan(0);

    // Canvas Owner should not get influence for meming own canvas //
    await userInfo.user.statistics.reload();
    expect(userInfo.user.statistics.influence).toEqual(0);

  });

  // Sometimes breaks! WHY!?!
  it('should give canvas owner influence when another user memes the canvas', async () => {
    const userInfo1 = await getNewAuthorizedUser();
    const userInfo2 = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo1.user.id);

    const res = await supertest(app)
      .post('/')
      .query(`canvasid=${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo2.token}`)
      .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

    expect(res.status).toBe(201);
    expect(res.body.memeId).toBeDefined();

    // The first user should get influence from second user memeing their canvas  //
    await userInfo1.user.statistics.reload();
    expect(userInfo1.user.statistics.influence).toEqual(EInfluence.memeCreated);

  });

  it('should fail if no auth token is present', async () => {
    const res = await supertest(app)
      .post('/');
      // .attach('meme', 'src/spec-helpers/images/medium-image.jpg');
      // TCP stream for image upload breaks if auth fails //

    expect(res.status).toEqual(401);
  });

  it('should fail if no canvas id is sent in query', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post('/')
      .set('Authorization', `Bearer ${userInfo.token}`);
      // .attach('meme', 'src/spec-helpers/images/medium-image.jpg');
      // TCP stream for image upload breaks if query string //

    expect(res.status).toEqual(400);
  });

  it('should fail if canvas cannot be found', async () => {
    const userInfo = await getNewAuthorizedUser();

    const res = await supertest(app)
      .post('/')
      .query('canvasid=3241234123')
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

    expect(res.status).toEqual(400);
  });

  it('should fail if meme file is not attached', async () => {
    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);

    const res = await supertest(app)
      .post('/')
      .query(`canvasid=${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`);

    expect(res.status).toEqual(400);
  });

  it('should fail if > 20 memes uploaded a day', async () => {
    // Delete all existing memes //
    await Meme.remove(await Meme.find());

    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const memeArray: number[] = [];

    // Create a lot of memes //
    for (let i = 0; i < 21; i += 1) {
      const res = await supertest(app)
      .post('/')
      .query(`canvasid=${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

      if (i < 20) {
        expect(res.body.memeId).toBeDefined();
        memeArray.push(res.body.memeId);
      } else {
        // On 21st meme attempted to be created today //
        expect(res.body.errors).toBeDefined();
      }
    }

  });

  it('should succeed if < 20 memes uploaded a day', async () => {
    // Delete all existing memes //
    await Meme.remove(await Meme.find());

    const userInfo = await getNewAuthorizedUser();
    const canvas = await getPhonyCanvas(userInfo.user.id);
    const memeArray: number[] = [];

    // Create 20 memes //
    for (let i = 0; i < 20; i += 1) {
      const res = await supertest(app)
        .post('/')
        .query(`canvasid=${canvas.id}`)
        .set('Authorization', `Bearer ${userInfo.token}`)
        .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

      memeArray.push(res.body.canvasId);
    }

    // Set the time of creation for the first meme to yesterday //
    const meme = await Meme.findOne(memeArray[0]);
    meme.utc.setDate(meme.utc.getDate() - 3);
    await meme.save();

    // Create another meme //
    const res = await supertest(app)
      .post('/')
      .query(`canvasid=${canvas.id}`)
      .set('Authorization', `Bearer ${userInfo.token}`)
      .attach('meme', 'src/spec-helpers/images/medium-image.jpg');

    // Meme should be made //
    expect(res.body.memeId).toBeDefined();

  });

});
