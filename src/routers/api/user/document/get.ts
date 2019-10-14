import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';
import { IUser } from 'shared/models';
import { getConnection } from 'typeorm';

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

    // Get number of followers //
    const followerNumber = await getConnection()
      .getRepository(UserNetwork)
      .createQueryBuilder('user_network')
      .where('user_network.user = :huid', { huid: user.id })
      .getCount();

    const profileData: Omit<IUser, 'activeCanvases'> = {
      id: user.id,
      firstName: user.firstName,
      username: user.username,
      photo: user.profileImg,
      influence: user.statistics.influence,
      followers: followerNumber,
      contentNumber: user.statistics.contentNum,
    };

    return res.send(profileData);
  }

  return next({ content: [{ detail: 'User not found' }], status: 404 });

});

export default router;
