import { Router } from 'express';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import { IUserSettings } from 'shared/models';

const router = Router({ mergeParams: true });

/**
 * @api {get} /user/:id/settings Get the settings for a user
 * @apiName GetUserSettings
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 *
 * @apiSuccess (200) {Object} userSettings JSON object describing the user settings
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // if the user does not own these settings //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access settings' }], status: 401 });

  const user = await User.findOne(req.params.id, { relations: ['settings'] });

  if (user) {
    const userSettingsData: IUserSettings = {
      notifications: {
        canvasInvites: user.settings.nCanvasInvites,
        subscriptionUploadedACanvas: user.settings.nSubscriptionUploadedACanvas,
        userMemedMyCanvas: user.settings.nUserMemedMyCanvas,
        pointsUpdate: user.settings.nPointsUpdate,
        newFollower: user.settings.nNewFollowers,
      },
    };

    return res.send(userSettingsData);
  }

});

export default router;
