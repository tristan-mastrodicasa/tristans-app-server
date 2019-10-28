import { User } from 'database/entities/user.entity';
import { userInfluenceManager, networkManager } from 'shared/helpers';
import { getNewAuthorizedUser } from './authorized-user-setup';
import { getPhonyCanvas } from './phony-canvas-setup';
import { getPhonyMeme } from './phony-meme-setup';
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

    // Test the points notification //
    User.findOne(+process.argv[2], { relations: ['statistics'] }).then((user) => {
      user.statistics.influence = 495; // Set the influence before a threshold
      user.statistics.save().then(() => {
        userInfluenceManager('add', user.id, 10); // Surpass the influence points threshold
      });
    });

    // Test the other user created a meme notification //
    getPhonyCanvas(+process.argv[2]).then((canvas) => { // User makes new canvas
      getNewAuthorizedUser().then((userInfo) => { // Generate a fake user
        getPhonyMeme(canvas.id, userInfo.user.id); // Get that fake user to meme your canvas
      });
    });

    // Test the user uploaded a new canvas notification //
    getNewAuthorizedUser().then((userInfo) => { // Generate a fake user
      networkManager('follow', +process.argv[2], userInfo.user.id).then(() => { // The main user follows this fake user
        getPhonyCanvas(userInfo.user.id); // Fake user uploads a new canvas
      });
    });

    // Test a new user follows you notification //
    getNewAuthorizedUser().then((userInfo) => { // Generate a fake user
      networkManager('follow', userInfo.user.id, +process.argv[2]).then(() => null); // Get the fake user to follow you
    });
  }

});
