import { Canvas } from './canvas.entity';
import { EVisibility } from 'shared/models';
import { validate } from 'class-validator';
import crypto from 'crypto';

describe('canvas entity', () => {
  const idealCanvas = new Canvas();

  beforeEach(() => {
    idealCanvas.description = 'I like cats';
    idealCanvas.imagePath = '/default/picture.jpg';
    idealCanvas.mimetype = 'image/jpeg';
    idealCanvas.visibility = EVisibility.followBacks;
    idealCanvas.uniqueKey = crypto.randomBytes(32).toString('hex');
  });

  it('should work with an ideal canvas', async () => {
    const errors = await validate(idealCanvas);
    expect(errors.length).toEqual(0);
  });

  describe('descriptions should', () => {

    it('succeed when it does not exist (its optional)', async () => {
      idealCanvas.description = null;

      const errors = await validate(idealCanvas);
      expect(errors.length).toEqual(0);
    });

  });

  describe('imagePath should', () => {

    it('fail when it does not exist', async () => {
      idealCanvas.imagePath = null;

      const errors = await validate(idealCanvas);
      expect(errors.length).toEqual(1);
    });

  });

  describe('mimetype should', () => {

    it('fail when it does not exist', async () => {
      idealCanvas.mimetype = '';

      const errors = await validate(idealCanvas);
      expect(errors.length).toEqual(1);
    });

  });

  describe('visibility should', () => {

    it('fail when it is not an enum', async () => {
      const canvas = Object.create(idealCanvas);
      canvas.visibility = 'bruh';

      const errors = await validate(canvas);
      expect(errors.length).toEqual(1);
    });

  });

  describe('unique key should', () => {

    it('fail when not specified length (64 characters long)', async () => {
      idealCanvas.uniqueKey = crypto.randomBytes(33).toString('hex');

      const errors = await validate(idealCanvas);
      expect(errors.length).toEqual(1);
    });

  });

});
