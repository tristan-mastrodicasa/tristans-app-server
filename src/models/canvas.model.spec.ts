import CanvasModel from './canvas.model';

describe('Canvas Model', () => {

  describe('descriptions should', () => {

    it('fail when too big (> 300 characters)', (done) => {

      const user = new CanvasModel({
        // 301 character String
        description: 's'.repeat(301),
      });

      user.validate((err) => {

        expect(err).not.toEqual(null);
        done();

      });

    });

  });

});
