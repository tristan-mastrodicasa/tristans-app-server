import CanvasModel from './canvas.model';

describe('Canvas Model', () => {

  describe('descriptions should', () => {

    it('fail when too big (> 255 characters)', (done) => {

      const user = new CanvasModel({
        // 256 character String
        description: 's'.repeat(256),
      });

      user.validate((err) => {

        expect(err).not.toEqual(null);
        done();

      });

    });

  });

});
