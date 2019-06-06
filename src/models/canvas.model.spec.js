import CanvasModel from './canvas.model';

describe('Canvas Model', () => {

  describe('descriptions should', () => {

    it('fail when too big (> 300 characters)', () => {

      const user = new CanvasModel({
        // 301 character String
        description: 'Lorem ipsum dolor sit amet, consectetuer adipsiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.',
      });

      user.validate((err) => {

        expect(err.errors.description).toEqual(jasmine.anything(Object));

      });

    });

  });

});
