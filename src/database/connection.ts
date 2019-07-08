import { createConnection as createNativeConnection } from 'mysql2/promise';
import { createConnection } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bluebird from 'bluebird'; // Imported for make mysql2/promise works

/**
 * This function it's used for create the database using a native mysql2 driver
 * after the database creation, TypeOrm it's loaded by using ormconfig.json file
 * if the an errors happen it close the application process showing the error
 */
export async function connectDatabase() {
  // Create a native connection to Mysql Database for create the database if not exist
  try {
    const nativeConnection = await createNativeConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    // Makes the query for create the database if not exist
    await nativeConnection.execute('CREATE DATABASE IF NOT EXISTS memeApp;');
    // After the database creation it initialize the TypeOrm connection using ormconfig.json file
    await createConnection();
  } catch (error) {
    // Show errors in the connection and close the application
    console.error(error);
    process.exit();
  }
}
