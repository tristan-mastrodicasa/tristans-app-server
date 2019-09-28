import supertest from 'supertest';
import express from 'express';
import router from './';
import { httpErrorMiddleware } from 'shared/helpers';

describe('POST google-authcode', () => {

  const app = express();
  app.use(router);
  app.use(httpErrorMiddleware);

  it('should fail if an invalid google authcode is sent', async () => {

    const res = await supertest(app)
      .post('/')
      .send('code=randominvalidcode')
      .set('Accept', 'application/json');

    expect(res.body.errors).toBeDefined();
    expect(res.status).toEqual(401);

  });

});
