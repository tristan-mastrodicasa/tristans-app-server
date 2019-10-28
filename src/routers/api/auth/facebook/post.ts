import { Router } from 'express';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import env from 'conf/env';
import { IJwt } from 'shared/models';

const router = Router();

router.post('/', (req, res, next) => {

  passport.authenticate('facebook-token', (_err, user) => {

    // Return the token //
    if (user) {

      res.json({ token: jsonwebtoken.sign(<IJwt>{ id: user.id }, env.jwt_key, { expiresIn: '90d' }) });

    } else {

      next({ content: [{ detail: 'Something went wrong' }], status: 401 });

    }

  })(req, res, next);

});

export default router;
