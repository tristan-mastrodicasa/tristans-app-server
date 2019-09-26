import { User } from './user.entity';
import { validate } from 'class-validator';

describe('user entity', () => {
  const idealUser = new User();

  beforeEach(() => {
    idealUser.username = 'johna123';
    idealUser.firstname = 'John';
    idealUser.email = 'me@email.com';
    idealUser.profileImg = '/default/picture.jpg';
  });

  it('should work with an ideal user', async () => {
    const errors = await validate(idealUser);
    expect(errors.length).toEqual(0);
  });

  describe('usernames should', () => {

    it('fail when too short', async () => {
      idealUser.username = '';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when too long', async () => {
      idealUser.username = 'a'.repeat(26);

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when not alpha numeric', async () => {
      idealUser.username = 'a$ba12';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('succeed when alpha numeric', async () => {
      idealUser.username = 'aba12';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(0);
    });

  });

  describe('first name should', () => {

    it('fail when too short', async () => {
      idealUser.firstname = '';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when too long', async () => {
      idealUser.firstname = 'a'.repeat(26);

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when not alpha', async () => {
      idealUser.firstname = 'aba12';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('succeed when alpha', async () => {
      idealUser.firstname = 'ababa';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(0);
    });

    it('fail when empty', async () => {
      idealUser.firstname = null;

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

  });

  describe('emails should', () => {

    it('succeed when null', async () => {
      idealUser.email = null;

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(0);
    });

    it('fail when not an email', async () => {
      idealUser.email = 'ababa';

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when too long', async () => {
      idealUser.email = `${'a'.repeat(240)}@m.com`;

      // Handled by @IsEmail, @MaxLength = backup //
      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

  });

  describe('profile images should', () => {

    it('fail when too long', async () => {
      idealUser.profileImg = 'a'.repeat(129);

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

    it('fail when doesn\'t exist', async () => {
      idealUser.profileImg = null;

      const errors = await validate(idealUser);
      expect(errors.length).toEqual(1);
    });

  });

});
