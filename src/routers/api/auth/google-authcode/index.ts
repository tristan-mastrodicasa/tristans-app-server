import { Router } from 'express';
import passport from 'passport';

import jsonwebtoken from 'jsonwebtoken';

import env from 'conf/env';

import { JwtContent, Token } from 'shared/models';

const router = Router();

/**
 * @api {post} /auth/google-authcode Verify authcode from google
 * @apiName Google Authcode Verifier
 * @apiGroup Google Authentication
 *
 * @apiParam {String} code The authcode return from the google authentication popup
 *
 * @apiSuccess {String} token The JWT for accessing protected routes
 *
 * @apiError (HTTP Error Codes) 401 Access key wrong or google server down
 */
router.post('/', (req, res) => {

  passport.authenticate('google-authcode', (_err, user) => {

    // Return the token //
    if (user) {

      console.log(`made it to authcode response ${user}`);

      const jwtObject: JwtContent = { id: user.id };
      const token: Token = { token: jsonwebtoken.sign(jwtObject, env.jwt_key, { expiresIn: '30d' }) };

      res.json(token);

    } else {

      throw { content: [{ detail: 'Access key wrong or google server down' }], status: 401 };

    }

  })(req, res);

});

export default router;
