import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { validate } from 'class-validator';
import { validationErrorToHttpResponse } from 'shared/helpers';

const router = Router({ mergeParams: true });

/**
 * @api {put} /user/:id Edit your user profile (only first name + user name)
 * @apiName EditUserProfile
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 * @apiParam {String} body.firstName The new first name
 * @apiParam {String} body.username The new username
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 400 Malformed body request / Username taken
 */
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own this resource  //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot modify profile' }], status: 401 });

  const user = await User.findOne(req.user.id);

  if (user) {
    // Explicitly define how the body should be formatted //
    const body: { username: string; firstName: string; } = req.body;
    const originalUsername = user.username;

    // Fail if the sent request is malformed //
    if (!body.firstName || !body.username) return next({ content: [{ detail: 'Malformed body' }], status: 400 });

    user.firstName = body.firstName;
    user.username = body.username;

    // Validate the submitted settings to update //
    const errors = await validate(user);
    if (errors.length > 0) {
      return next(validationErrorToHttpResponse(errors));
    }

    // Check no other usernames exist //
    /** @todo write unit test to make sure the original username can be uploaded without causing a Username taken error */
    if (originalUsername !== user.username) {
      if (await User.findOne({ username: user.username })) return next({ content: [{ detail: 'Username taken' }], status: 400 });
    }

    // Catches errors (mostly when non nullable fields are null) //
    try {
      await user.save();
    } catch (err) {
      return next({ content: [{ detail: 'Database rejected input' }], status: 400 });
    }

    return res.status(200).send();
  }

});

export default router;
