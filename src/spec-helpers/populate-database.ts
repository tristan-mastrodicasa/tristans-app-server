import faker from 'faker';
import crypto from 'crypto';
import fs from 'fs';
import jsImageGenerator from 'js-image-generator';
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
 */
(async () => {

  const users: { id: number, utc: Date }[] = [];
  const canvases: { id: number, utc: Date }[] = [];
  const memes: { id: number, utc: Date }[] = [];

  // reset database //
  const conn = await createConnection(ormconfig);
  await conn.synchronize(true);

  // Create a number of users, store their ID's //
  console.log('Generating ~500 users');
  await runAsyncConcurrently(
    async () => {
      try {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.username = `${faker.lorem.word()}${faker.random.number()}`;
        user.profileImg = faker.fake('{{image.avatar}}');
        user.profileImgMimeType = 'image/jpeg';
        const weekAgo = new Date(); weekAgo.setDate(new Date().getDate() - 7);
        user.utc = getRandomDate(weekAgo, new Date());

        const userRecord = await createNewUser(user);
        users.push({ id: userRecord.id, utc: user.utc });
      } catch (err) {} // Validation errors are skipped
    },
    500,
  );

  // Have some of them create canvases with varied times of creation, store ID's (about 1,000)//
  console.log('Generating ~40 canvases');
  await runAsyncConcurrently(
    async () => {
      try {
        const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
        const canvas = new Canvas();

        canvas.description = faker.lorem.sentence();
        canvas.imagePath = createImage('canvas');
        canvas.mimetype = 'image/jpeg';
        canvas.visibility = EVisibility.public; // Only public to start
        canvas.uniqueKey = crypto.randomBytes(32).toString('hex');
        canvas.utc = getRandomDate(user.utc, new Date()); // Get a random date between now and the user creation date

        const canvasRecord = await createNewCanvas(canvas, user.id);
        canvases.push({ id: canvasRecord.id, utc: canvas.utc });
      } catch (err) { console.log(err); } // Validation errors are skipped
    },
    40,
  );

  // Have some of them create memes for some of the canvases, with varied time after the canvas creation //
  console.log('Generating ~500 memes');
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
    500,
  );

  // Have the users react to random canvases //
  process.stdout.write('Generating ~1000 reacts to canvases');
  await runAsyncConcurrently(
    async () => {
      // Get a random user and canvas //
      const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
      const canvas = canvases[Math.floor((Math.random() * canvases.length - 1) + 1)];

      await canvasReactManager('add', canvas.id, user.id);
    },
    1000,
  );

  console.log();

  // Have the users react to random memes //
  process.stdout.write('Generating ~2000 reacts to memes');
  await runAsyncConcurrently(
    async () => {
      // Get a random user and meme //
      const user = users[Math.floor((Math.random() * users.length - 1) + 1)];
      const meme = memes[Math.floor((Math.random() * canvases.length - 1) + 1)];

      await memeReactManager('add', meme.id, user.id);
    },
    2000,
  );

  console.log();

  // Have the users follow a random selection of other users //
  process.stdout.write('Users following users');
  for (let i = 0; i < (users.length); i += 1) {

    if (i % 10 === 0) process.stdout.write('.');

    await runAsyncConcurrently(
      async () => {
        // Get a random user and meme //
        const user = users[i];
        const otherUser = users[Math.floor((Math.random() * users.length - 1) + 1)];

        await networkManager('follow', user.id, otherUser.id);
      },
      Math.floor((Math.random() * 50) + 10),
    );
  }

  console.log();

  process.exit();

})();

/**
 * Return a random date between two others
 */
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Create a fake image
 * @param  imageType Which path the function should output the image too
 * @return           File name
 */
function createImage(imageType: 'canvas' | 'meme'): string {
  // Generate a new image //
  const fileName = `${Math.random() * 10000}`;

  jsImageGenerator.generateImage(800, 600, 40, (_err: any, image: any) => {
    const imgPath = `uploads/${imageType}_images/${fileName}`;
    fs.writeFileSync(imgPath, image.data);
  });

  return fileName;
}
