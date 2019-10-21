import supertest from 'supertest';
import express from 'express';
import post from './post';
import { httpErrorMiddleware } from 'shared/helpers';

describe('POST auth/facebook', () => {

  const app = express();
  app.use(post);
  app.use(httpErrorMiddleware);

  it('should fail if an invalid facebook access token is sent', async () => {

    const res = await supertest(app)
      .post('/')
      .send('access_token=randominvalidtoken')
      .set('Accept', 'application/json');

    expect(res.body.errors).toBeDefined();
    expect(res.status).toEqual(401);

  });

});
