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
 * @apiDescription Checks if a user exists, if they don't then create a user
 *
 * @apiParam {String} code The authcode returned from the google authentication popup
 *
 * @apiSuccess {String} token The JWT for accessing protected routes
 *
 * @apiError (HTTP Error Codes) 401 Access key wrong or google server down
 */
router.post('/', (req, res, next) => {

  passport.authenticate('google-authcode', (_err, user) => {

    // Return the token //
    if (user) {

      const jwtObject: JwtContent = { id: user.id };
      const token: Token = { token: jsonwebtoken.sign(jwtObject, env.jwt_key, { expiresIn: '30d' }) };

      res.json(token);

    } else {

      next({ content: [{ detail: 'Access key wrong or google server down' }], status: 401 });

    }

  })(req, res, next);

});

export default router;
