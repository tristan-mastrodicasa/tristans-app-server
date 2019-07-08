import { Router } from 'express';
import facebook from 'fb';
import UserModel from '../../../../entity/user/user.entity';

const signup = Router();

/**
 * @api {post} /authentication/signup/ Generate a user account
 * @apiName Signup
 * @apiGroup Authentication
 *
 * @apiParam {String} access_token The access token for the users Facebook
 *
 * @apiSuccess {Object} The user object
 *
 * @apiError (HTTP Error Codes) 400 Missing Facebook Access Token
 * @apiError (HTTP Error Codes) 400 You are already registered with this facebook account
 * @apiError (HTTP Error Codes) 500 Communication with facebook servers sucks
 */
signup.post('/', (req, res, next) => {
  // Verify the request //
  const facebookAccessToken = req.body.access_token;

  if (!facebookAccessToken) throw { content: 'Missing Facebook Access Token', status: 400 };

  facebook.api(
    'me',
    { fields: ['first_name', 'last_name', 'id'], access_token: facebookAccessToken },
    async response => {
      if (response.error) next({ content: response.error.message, status: 500 });
      else {
        const isRegistered = await UserModel.findOne({ fbid: response.id });

        if (!isRegistered) {
          // Fix the user sign up //
          const user = await UserModel.create({
            fbid: response.id,
            firstName: response.first_name,
          });

          return res.send({ user });
        } else next({ content: 'You are already registered with this facebook account', status: 400 });
      }
    },
  );
});

export default signup;
