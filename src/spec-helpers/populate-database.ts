import faker from 'faker';
import crypto from 'crypto';
import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { Meme } from 'database/entities/meme.entity';
import {
  runAsyncConcurrently,
  createNewUser,
  createNewCanvas,
  createNewMeme,
  memeReactManager,
  canvasReactManager,
  networkManager,
} from 'shared/helpers';
import { EVisibility } from 'shared/models';
import { createConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';
import 'conf/passport';

/**
 * Populate the entire databse with fake content to
 * simulate what a full database of users and content would look
 * and feel like on the client
 *
 * There may be a populate-database.sql script you can use instead to save time,
 * if it is outdated please remake it
 */
(async () => {

  const users: { id: number, utc: Date }[] = [];
  const canvases: { id: number, utc: Date }[] = [];
  const memes: { id: number, utc: Date }[] = [];

  // reset database //
  const conn = await createConnection(ormconfig);
  await conn.synchronize(true);

  // Create a number of users, store their ID's, (about 10,000) //
  console.log('Generating ~10,000 users');
  await runAsyncConcurrently(
    async () => {
      try {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.username = `${faker.lorem.word()}${faker.random.number()}`;
        user.profileImg = faker.fake('{{image.avatar}}');
        user.profileImgMimeType = 'image/jpeg';
        user.utc = getRandomDate(new Date(2017, 1, 1), new Date());

        const userRecord = await createNewUser(user);
        users.push({ id: userRecord.id, utc: user.utc });
      } catch (err) {} // Validation errors are skipped
    },
    10000,
  );

  // Have some of them create canvases with varied times of creation, store ID's (about 1,000)//
  console.log('Generating ~1,000 canvases');
  await runAsyncConcurrently(
    async () => {
      try {
        const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
        const canvas = new Canvas();
        canvas.description = faker.lorem.sentence();
        canvas.imagePath = faker.image.imageUrl();
        canvas.mimetype = 'image/jpeg';
        canvas.visibility = EVisibility.public; // Only public to start
        canvas.uniqueKey = crypto.randomBytes(32).toString('hex');
        canvas.utc = getRandomDate(user.utc, new Date()); // Get a random date between now and the user creation date

        const canvasRecord = await createNewCanvas(canvas, user.id);
        canvases.push({ id: canvasRecord.id, utc: canvas.utc });
      } catch (err) {} // Validation errors are skipped
    },
    1000,
  );

  // Have some of them create memes for some of the canvases, with varied time after the canvas creation (about 5,000) (store ID's)//
  console.log('Generating ~5,000 memes');
  await runAsyncConcurrently(
    async () => {
      try {
        // Get a random user and canvas //
        const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
        const canvas = canvases[Math.floor((Math.random() * canvases.length - 1) + 1)];

        const meme = new Meme();
        meme.imagePath = faker.image.imageUrl();
        meme.mimetype = 'image/jpeg';
        meme.utc = getRandomDate((user.utc > canvas.utc ? user.utc : canvas.utc), new Date()); // Get a random date between the latest of the canvas / user and now

        const memeRecord = await createNewMeme(meme, canvas.id, user.id);
        memes.push({ id: memeRecord.id, utc: canvas.utc });
      } catch (err) {} // Validation errors are skipped
    },
    5000,
  );

  // Have the users react to random canvases (70,000 reacts) //
  process.stdout.write('Generating ~70,000 reacts to canvases');
  for (let i = 0; i < 7; i += 1) {
    process.stdout.write('.');
    await runAsyncConcurrently(
      async () => {
        // Get a random user and canvas //
        const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
        const canvas = canvases[Math.floor((Math.random() * canvases.length - 1) + 1)];

        await canvasReactManager('add', canvas.id, user.id);
      },
      10000,
    );
  }

  console.log();

  // Have the users react to random memes (150,000 reacts) //
  process.stdout.write('Generating ~150,000 reacts to memes');
  for (let i = 0; i < 15; i += 1) {
    process.stdout.write('.');
    await runAsyncConcurrently(
      async () => {
        // Get a random user and meme //
        const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
        const meme = memes[Math.floor((Math.random() * canvases.length - 1) + 1)];

        await memeReactManager('add', meme.id, user.id);
      },
      10000,
    );
  }

  console.log();

  // Have the users follow a random selection of other users (between 10 - 1000) //
  process.stdout.write('Users following users');
  for (let i = 0; i < (users.length / 2); i += 1) {

    if (i % 500 === 0) process.stdout.write('.');

    await runAsyncConcurrently(
      async () => {
        // Get a random user and meme //
        const user = users[i];
        const otherUser = users[Math.floor((Math.random() * users.length - 1) + 1)];

        await networkManager('follow', user.id, otherUser.id);
      },
      Math.floor((Math.random() * 500) + 10),
    );
  }

  console.log();

  process.exit();

})();

/**
 * Return a random date between 2017 and now
 */
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
