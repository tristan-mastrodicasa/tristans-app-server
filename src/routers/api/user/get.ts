import { Router } from 'express';
import passport from 'passport';
import { getConnection } from 'typeorm';
import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';
import { IUserItem } from 'shared/models';
import { checkForActiveCanvases, buildImageUrl } from 'shared/helpers';

const router = Router({ mergeParams: true });

/** @todo add the recommended query option later (people from your local network aka mutual friends) */
/** @todo rate limiting? */

/**
 * @api {get} /user Get a collection of users
 * @apiName GetUserCollection
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {String} query The query string to search the database
 *
 * @apiSuccess (200) {Object[]} body List of user items from the database
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 404 Cannot find any users
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  let results: User[] = [];

  /** @todo Write a test to assert order by influence */
  /** @todo Write a test to assert that the user follows you and display it */
  /** @todo Change these horrible queries to User.find() calls */
  if (!req.query.query) {
    results = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .select()
      .leftJoinAndSelect('user.statistics', 'user_statistics')
      .orderBy('user_statistics.influence', 'DESC')
      .limit(50)
      .getMany();
  } else {

    // Search database //
    results = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.statistics', 'user_statistics')
      .where('MATCH(username) AGAINST (:searchTerm IN BOOLEAN MODE)', { searchTerm: `${req.query.query}*` })
      .orWhere('MATCH(firstName) AGAINST (:searchTerm IN BOOLEAN MODE)', { searchTerm: `${req.query.query}*` })
      .limit(50)
      .getMany();

  }

  if (results.length > 0) {

    const userItems: IUserItem[] = [];

    // compile user items and ship //
    for (const userRow of results) {
      userItems.push({
        id: userRow.id,
        firstName: userRow.firstName,
        username: userRow.username,
        photo: buildImageUrl('user', userRow.profileImg),
        influence: userRow.statistics.influence,
        youAreFollowing: (await UserNetwork.findOne({ user: userRow, follower: req.user.id }) ? true : false),
        activeCanvases: await checkForActiveCanvases(userRow.id),
      });
    }

    return res.send(userItems);

  }

  // No user items returned //
  return next({ content: [{ detail: 'No users found' }], status: 404 });

});

export default router;
