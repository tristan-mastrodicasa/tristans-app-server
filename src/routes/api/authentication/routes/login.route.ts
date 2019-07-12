import { Router } from 'express';
import facebook from 'fb';
import jwt from 'jsonwebtoken';
import { User } from '../../../../database/entity/user/user.entity';

const login = Router();

/**
 * @api {post} /authentication/login/ Collect an access token for a registered user
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} access_token The access token for the users Facebook
 *
 * @apiSuccess {String} jwtToken Access token for protected routes
 *
 * @apiError (HTTP Error Codes) 400 Missing Facebook Access Token
 * @apiError (HTTP Error Codes) 404 Facebook ID is not found in the database
 * @apiError (HTTP Error Codes) 500 Communication with facebook servers sucks
 */
login.post('/', (req, res, next) => {

  // Verify the request //
  const facebookAccessToken = req.body.access_token;

  if (!facebookAccessToken) throw { content: 'Missing Facebook Access Token', status: 400 };

  // Authenticate with facebook //
  facebook.api('me', { fields: ['id'], access_token: facebookAccessToken }, async response => {

    if (response.error) next({ content: response.error.message, status: 500 });
    else {

      /* const isUserFound = await User.findOne({ fbid: response.id });

      if (isUserFound) {

        const jwtToken = jwt.sign(isUserFound.toJSON(), 'secretkey');

        return res.send({ jwtToken });

      } else next({ content: 'Facebook ID is not found in the database', status: 404 });
      */

    }

  });

});

export default login;
