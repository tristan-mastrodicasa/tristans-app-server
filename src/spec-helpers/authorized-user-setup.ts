import jsonwebtoken from 'jsonwebtoken';
import env from 'conf/env';
import { User } from 'database/entities/user.entity';
import { createNewUser } from 'shared/helpers';
import { JwtContent } from 'shared/models';

/**
 * Generate a new user and get a JWT for it (to use with passport)
 * Remember to delete the user after specs complete
 * @return The JWT and
 */
export async function getNewAuthorizedUser(): Promise<{ token: string, user: User }> {

  const user = new User();
  user.profileImg = 'default-image.jpg';
  user.profileImgMimeType = 'image/jpeg';

  const newUser = await createNewUser(user, true);

  const jwtContent: JwtContent = { id: newUser.id };
  const token = jsonwebtoken.sign(jwtContent, env.jwt_key, { expiresIn: '1d' });

  return { token, user: newUser };

}
