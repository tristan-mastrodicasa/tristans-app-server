import { Router } from 'express';
import passport from 'passport';

import jsonwebtoken from 'jsonwebtoken';

import env from 'conf/env';

import { JwtContent, Token } from 'shared/models';

const router = Router();

// Pass an authcode to verify google signin //
/** @test By logging in on mobile with the google option */
router.post('/', (req, res) => {

  passport.authenticate('google-authcode', (_err, user) => {

    // Return the token //
    if (user) {

      console.log(`made it to authcode response ${user}`);

      const jwtObject: JwtContent = { id: user.id };
      const token: Token = { token: jsonwebtoken.sign(jwtObject, env.jwt_key, { expiresIn: '30d' }) };

      res.json(token);

    } else {

      throw { content: [{ detail: 'Access key wrong or server down' }], status: 401 };

    }

  })(req, res);

});

export default router;
