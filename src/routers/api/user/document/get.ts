import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { Profile } from 'shared/models';

const router = Router({ mergeParams: true });

/**
 * @api {get} /user/:id Get a user document
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {Object} profile JSON object describing the user
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 404 Cannot find user
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const user = await User.findOne(req.params.id, { relations: ['statistics'] });

  if (user) {
    const profileData: Profile = {
      id: user.id,
      firstName: user.firstname,
      username: user.username,
      photo: user.profileImg,
      influence: user.statistics.influence,
      followers: user.statistics.followers,
      contentNumber: user.statistics.contentNum,
    };

    return res.send(profileData);
  }

  return next({ content: [{ detail: 'User not found' }], status: 404 });

});

export default router;
