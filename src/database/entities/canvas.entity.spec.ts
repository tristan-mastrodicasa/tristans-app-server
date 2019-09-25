import { Canvas } from './canvas.entity';
import { EVisibility } from 'shared/models';
import { validate } from 'class-validator';
import crypto from 'crypto';

describe('canvas entity', () => {

  const idealCanvas = new Canvas();
  idealCanvas.description = 'I like cats';
  idealCanvas.imagePath = '/default/picture.jpg';
  idealCanvas.mimetype = 'image/jpeg';
  idealCanvas.visibility = EVisibility.followBacks;
  idealCanvas.uniqueKey = crypto.randomBytes(32).toString('hex');

  it('should work with an ideal canvas', async () => {
    await validate(idealCanvas).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  describe('descriptions should', () => {

    it('succeed when it does not exist (its optional)', async () => {
      const nonIdealCanvas = Object.create(idealCanvas);
      nonIdealCanvas.description = null;

      await validate(nonIdealCanvas).then((errors) => {
        expect(errors.length).toEqual(0);
      });
    });

  });

  describe('imagePath should', () => {

    it('fail when it does not exist', async () => {
      const nonIdealCanvas = Object.create(idealCanvas);
      nonIdealCanvas.imagePath = null;

      await validate(nonIdealCanvas).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

  describe('mimetype should', () => {

    it('fail when it does not exist', async () => {
      const nonIdealCanvas = Object.create(idealCanvas);
      nonIdealCanvas.mimetype = '';

      await validate(nonIdealCanvas).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

  describe('visibility should', () => {

    it('fail when it is not an enum', async () => {
      const nonIdealCanvas = Object.create(idealCanvas);
      nonIdealCanvas.visibility = 'bruh';

      await validate(nonIdealCanvas).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

  describe('unique key should', () => {

    it('fail when not specified length (64 characters long)', async () => {
      const nonIdealCanvas = Object.create(idealCanvas);
      nonIdealCanvas.uniqueKey = crypto.randomBytes(33).toString('hex');

      await validate(nonIdealCanvas).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

});
