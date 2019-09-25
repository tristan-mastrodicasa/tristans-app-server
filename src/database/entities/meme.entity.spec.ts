import { Meme } from './meme.entity';
import { validate } from 'class-validator';

describe('meme entity', () => {

  const idealMeme = new Meme();
  idealMeme.imagePath = '/uploaded_meme/3ABC1345FAE123.jpg';

  it('should work with an ideal meme', async () => {
    await validate(idealMeme).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  describe('image path should', () => {

    it('fail when too short', async () => {
      const nonIdealMeme = Object.create(idealMeme);
      nonIdealMeme.imagePath = '';

      await validate(nonIdealMeme).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('should fail when empty', async () => {
      const nonIdealMeme = Object.create(idealMeme);
      nonIdealMeme.imagePath = '';

      await validate(nonIdealMeme).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

});
