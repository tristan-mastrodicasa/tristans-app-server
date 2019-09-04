import { Router } from 'express';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';

import env from '../../../conf/env';

import { Token, JwtContent } from '../../../utils/response.interface';

const router = Router();

router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/redirect', passport.authenticate('google'), (_req, res) => {

  res.redirect('/auth/test');

});

router.post('/authcode', (req, res) => {

  passport.authenticate('google-authcode', (_err, user) => {

    // Return the token //
    if (user) {

      console.log(`made it to authcode response ${user}`);

      /** @todo move secret key to env */
      const jwtObject: JwtContent = { id: user.id };
      const token: Token = { token: jsonwebtoken.sign(jwtObject, env.jwt_key, { expiresIn: '30d' }) };

      res.json(token);

    } else {

      throw { content: [{ detail: 'Access key wrong or server down' }], status: 401 };

    }

  })(req, res);

});

export default router;
