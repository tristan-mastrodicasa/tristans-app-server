import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { IUserSettings } from 'shared/models';
import { validationErrorToHttpResponse } from 'shared/helpers';
import { validate } from 'class-validator';

const router = Router({ mergeParams: true });

/**
 * @api {put} /user/:id/settings Edit the settings for a user
 * @apiName EditUserSettings
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 400 Malformed body request / Database failure
 */
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own these settings //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot modify settings' }], status: 401 });

  const user = await User.findOne(req.params.id, { relations: ['settings'] });

  if (user) {
    // Explicitly define how the body should be formatted //
    const body: IUserSettings = req.body;

    // Fail if the sent request is malformed //
    try {
      user.settings.nCanvasInvites = body.notifications.canvasInvites;
      user.settings.nSubscriptionUploadedACanvas = body.notifications.subscriptionUploadedACanvas;
      user.settings.nUserMemedMyCanvas = body.notifications.userMemedMyCanvas;
      user.settings.nPointsUpdate = body.notifications.pointsUpdate;
    } catch (err) {
      return next({ content: [{ detail: 'Malformed body' }], status: 400 });
    }

    // Validate the submitted settings to update //
    const errors = await validate(user.settings);
    if (errors.length > 0) {
      return next(validationErrorToHttpResponse(errors));
    }

    // Catches errors (mostly when non nullable fields are null) //
    try {
      await user.settings.save();
    } catch (err) {
      return next({ content: [{ detail: 'Database rejected input' }], status: 400 });
    }

    return res.status(200).send();
  }

});

export default router;
