import { Router } from 'express';
import passport from 'passport';
import { getUserNetwork } from 'shared/helpers';

const router = Router({ mergeParams: true });

/**
 * @api {get} /user/:id/follow-backs Get the follow backs for a user
 * @apiName GetUserFollowerBacks
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {UserItem[]} body Array of JSON objects describing users
 *
 * @apiError (HTTP Error Codes) 404 Cannot find any follow backs
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own this account, REJECT FAM //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access follow back list' }], status: 401 });

  // Get the user's follow back list //
  const userItems = await getUserNetwork('follow-backs', req.user.id);

  if (userItems.length > 0) return res.json(userItems);

  // No user items returned //
  return next({ content: [{ detail: 'No users found' }], status: 404 });

});

export default router;
