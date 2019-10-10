import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { UserItem } from 'shared/models';
import { checkForActiveCanvases } from 'shared/helpers';

const router = Router({ mergeParams: true });

/** @todo When reaching production allow pagination for whole user list */
/** @todo When ordering by canvas do it before getting the most recent users (in prod)*/

/**
 * @api {get} /user/:id/followers Get the followers for a user
 * @apiName GetUserFollowers
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {UserItem[]} body Array of JSON objects users
 *
 * @apiError (HTTP Error Codes) 404 Cannot find any followers
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own this account, REJECT FAM //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access follower list' }], status: 401 });

  const user = await User.findOne(req.params.id, { relations: ['followers', 'followers.follower', 'followers.follower.statistics'] });

  // Container for user items //
  const userItems: UserItem[] = [];

  if (user) {

    // Combine the meme and canvas arrays //
    let content = user.followers;

    // Sort by UTC decending (newest follower first) //
    content.sort((a, b) => {
      return +b.utc - +a.utc;
    });

    // Limit 150 users //
    content = content.splice(0, 150);

    // compile user items and ship //
    for (const userNetwork of content) {
      userItems.push({
        id: userNetwork.follower.id,
        firstName: userNetwork.follower.firstName,
        username: userNetwork.follower.username,
        photo: userNetwork.follower.profileImg,
        influence: userNetwork.follower.statistics.influence,
        activeCanvases: await checkForActiveCanvases(userNetwork.follower.id),
      });
    }

    // Move those with active canvases to display first //
    userItems.sort((a, b) => {
      return b.activeCanvases - a.activeCanvases;
    });

  }

  if (userItems.length > 0) return res.json(userItems);

  // No user items returned //
  return next({ content: [{ detail: 'No users found' }], status: 404 });

});

export default router;
