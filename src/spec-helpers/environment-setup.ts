import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

beforeAll(async () => {
  const conn = await createConnection(ormconfig);
  await conn.synchronize(true);
});

afterAll(async () => {
  await getConnection().close();
});
