import { NotificationManager } from 'shared/helpers';
import { createConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';

/**
 * Script to test the push notifications functionality
 */
createConnection(ormconfig).then(() => {

  if (!process.argv[2]) {
    console.log('Please pass user id to test');
  } else {
    console.log('test');
    console.log(process.argv[2]);

    NotificationManager.sendPointsPushNotification(+process.argv[2], 10000);
  }

});
