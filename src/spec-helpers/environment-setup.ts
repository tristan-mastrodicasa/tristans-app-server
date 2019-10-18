import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

beforeAll(async () => {
  // Unit tests should work with the db_test database //
  const dbConfig = { ...ormconfig };
  dbConfig.database = `${dbConfig.database}_test`;

  const conn = await createConnection(dbConfig);
  await conn.synchronize(true);
});

afterAll(async () => {
  await getConnection().close();
});
