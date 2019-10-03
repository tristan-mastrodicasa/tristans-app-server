import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

beforeAll(async () => {
  await createConnection(ormconfig);
});

afterAll(async () => {

  // Reset entire database //
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.dropDatabase(<string>ormconfig.database);
  await queryRunner.createDatabase(<string>ormconfig.database, true);

  await getConnection().close();

});
