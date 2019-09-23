import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @api {get} /auth/test A protected route
 * @apiName GetProtectedRoute
 * @apiGroup Authentication Test
 *
 * @apiHeader {String} Authorization Bearer [token]
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  console.log('test route accessed');
  res.json({ msg: `You made it! ${req.user.id}` });

});

export default router;
