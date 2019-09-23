import { User } from './user.entity';
import { validate } from 'class-validator';

describe('user entity', () => {

  const idealUser = new User();
  idealUser.username = 'johna123';
  idealUser.firstname = 'John';
  idealUser.email = 'me@email.com';
  idealUser.profileImg = '/default/picture.jpg';

  it('should work with an ideal user', async () => {
    await validate(idealUser).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  describe('usernames should', () => {

    it('fail when too short', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.username = '';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when too long', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.username = 'a'.repeat(26);

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when not alpha numeric', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.username = 'a$ba12';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('succeed when alpha numeric', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.username = 'aba12';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(0);
      });
    });

  });

  describe('first name should', () => {

    it('fail when too short', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.firstname = '';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when too long', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.firstname = 'a'.repeat(26);

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when not alpha', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.firstname = 'aba12';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('succeed when alpha', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.firstname = 'ababa';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(0);
      });
    });

    it('fail when empty', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.firstname = null;

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

  describe('emails should', () => {

    it('succeed when null', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.email = null;

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(0);
      });
    });

    it('fail when not an email', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.email = 'ababa';

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when too long', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.email = `${'a'.repeat(240)}@m.com`;

      // Handled by @IsEmail, @MaxLength = backup //
      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

  describe('profile images should', () => {

    it('fail when too long', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.profileImg = 'a'.repeat(129);

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

    it('fail when doesn\'t exist', async () => {
      const nonIdealUser = Object.create(idealUser);
      nonIdealUser.profileImg = null;

      await validate(nonIdealUser).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });

  });

});
