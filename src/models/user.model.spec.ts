import UserModel from './user.model';

describe('User Model', () => {

  describe('usernames should', () => {

    it('fail when too small (< 5 characters)', (done) => {

      const user = new UserModel({ username: 'aasa' });

      user.validate((err) => {

        expect(err.errors.username).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when nothing is passed (null)', (done) => {

      const user = new UserModel({ username: null });

      user.validate((err) => {

        expect(err.errors.username).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when string is too big (> 25 characters)', (done) => {

      const user = new UserModel({ username: 'aaaaaaaaaaaaaaaaaaaaaaaaaa' });

      user.validate((err) => {

        expect(err.errors.username).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when not just constters and digits', (done) => {

      const user = new UserModel({ username: 'Ac0asd9}' });

      user.validate((err) => {

        expect(err.errors.username).toEqual(jasmine.any(Object));
        done();

      });

    });

  });

  describe('first names should', () => {

    it('fail when too small (< 5 characters)', (done) => {

      const user = new UserModel({ firstName: 'aasa' });

      user.validate((err) => {

        expect(err.errors.firstName).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when nothing is passed (null)', (done) => {

      const user = new UserModel({ firstName: null });

      user.validate((err) => {

        expect(err.errors.firstName).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when string is too big (> 25 characters)', (done) => {

      const user = new UserModel({ firstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaa' });

      user.validate((err) => {

        expect(err.errors.firstName).toEqual(jasmine.any(Object));
        done();

      });

    });

    it('fail when string has characters other than hypthens and constters', (done) => {

      const user = new UserModel({ firstName: 'wuteverareyou-l+' });

      user.validate((err) => {

        expect(err.errors.firstName).toEqual(jasmine.any(Object));
        done();

      });

    });

  });

});
