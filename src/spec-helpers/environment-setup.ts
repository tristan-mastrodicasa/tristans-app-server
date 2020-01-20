import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

// Change the default timeout interval (for da slow peoples) //
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
console.log('If you are getting timeout errors consider improving mysql performance \n \
--> https://github.com/docker/for-linux/issues/247#issuecomment-389900952');

beforeAll(async () => {
  // Unit tests should access the db_test container //
  const dbConfig = { ...ormconfig, host: 'db_test' };

  const conn = await createConnection(dbConfig);
  await conn.synchronize(true);
});

afterAll(async () => {
  await getConnection().close();
});
