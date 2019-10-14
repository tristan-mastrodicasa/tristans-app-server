import { Router } from 'express';
import passport from 'passport';
import { getUserNetwork } from 'shared/helpers';

const router = Router({ mergeParams: true });

/**
 * @api {get} /user/:id/following Get the subscriptions for a user
 * @apiName GetUserSubscriptions
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {Omit<IUser, 'followers' | 'contentNumber'>[]} body Array of JSON objects describing users
 *
 * @apiError (HTTP Error Codes) 404 Cannot find any subscriptions
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own this account, REJECT FAM //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access following list' }], status: 401 });

  // Get the user's following list //
  const userItems = await getUserNetwork('following', req.user.id);

  // Return user items if they exist //
  if (userItems.length > 0) return res.json(userItems);

  // No user items returned //
  return next({ content: [{ detail: 'No users found' }], status: 404 });

});

export default router;
