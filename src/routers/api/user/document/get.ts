import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';
import { IProfile } from 'shared/models';

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
 * @apiSuccess (200) {IProfile} profile JSON object describing the user
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 404 Cannot find user
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const user = await User.findOne(req.params.id, { relations: ['statistics'] });

  if (user) {

    /** @todo write unit test for youAreFollowing */
    const profileData: IProfile = {
      id: user.id,
      firstName: user.firstName,
      username: user.username,
      photo: user.profileImg,
      influence: user.statistics.influence,
      followers: await UserNetwork.count({ where: { user } }),
      youAreFollowing: (await UserNetwork.findOne({ user, follower: req.user.id }) ? true : false),
      contentNumber: user.statistics.contentNum,
    };

    return res.send(profileData);
  }

  return next({ content: [{ detail: 'User not found' }], status: 404 });

});

export default router;
