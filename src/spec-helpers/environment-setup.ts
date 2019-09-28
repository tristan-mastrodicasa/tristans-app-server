import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

beforeAll(async () => {
  await createConnection(ormconfig);
});

afterAll(async () => {
  await getConnection().close();
});
