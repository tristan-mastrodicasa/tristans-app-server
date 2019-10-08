import { Router } from 'express';
import passport from 'passport';
import { UserSettings } from 'database/entities/user-settings.entity';
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

  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot access settings' }], status: 401 });

  const userSettings = await UserSettings.findOne(req.params.id);

  if (userSettings) {
    const userSettingsData: IUserSettings = {
      notifications: {
        canvasInvites: userSettings.nCanvasInvites,
        subscriptionUploadedACanvas: userSettings.nSubscriptionUploadedACanvas,
        userMemedMyCanvas: userSettings.nUserMemedMyCanvas,
        pointsUpdate: userSettings.nPointsUpdate,
      },
    };

    return res.send(userSettingsData);
  }

});

export default router;
