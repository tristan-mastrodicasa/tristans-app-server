import { Meme } from './meme.entity';
import { validate } from 'class-validator';

describe('meme entity', () => {
  const idealMeme = new Meme();

  beforeEach(() => {
    idealMeme.imagePath = '/uploaded_meme/3ABC1345FAE123.jpg';
    idealMeme.mimetype = 'image/jpeg';
  });

  it('should work with an ideal meme', async () => {
    const errors = await validate(idealMeme);
    expect(errors.length).toEqual(0);
  });

  describe('image path should', () => {

    it('fail when too short', async () => {
      idealMeme.imagePath = '';

      const errors = await validate(idealMeme);
      expect(errors.length).toEqual(1);
    });

    it('should fail when empty', async () => {
      idealMeme.imagePath = null;

      const errors = await validate(idealMeme);
      expect(errors.length).toEqual(1);
    });

  });

});
