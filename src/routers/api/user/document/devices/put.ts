import { Router } from 'express';
import passport from 'passport';
import { MobileRelations } from 'database/entities/mobile-relations.entity';
import { User } from 'database/entities/user.entity';
import { IMobileDevice } from 'shared/models';
import { validationErrorToHttpResponse } from 'shared/helpers';
import { validate } from 'class-validator';

const router = Router({ mergeParams: true });

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  // If the user does not own these settings //
  if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot modify device settings' }], status: 401 });

  let mobileRelation: MobileRelations;

  // Get the mobile relation if it exists //
  mobileRelation = await MobileRelations.findOne({ user: req.user.id });

  // Create the record if it does not exist //
  if (!mobileRelation) {
    mobileRelation = new MobileRelations();
    mobileRelation.user = await User.findOne(req.user.id);
  }

  if (mobileRelation) {
    // Explicitly define how the body should be formatted //
    const body: IMobileDevice = req.body;

    // Fail if the sent request is malformed //
    try {
      mobileRelation.deviceId = body.deviceId;
    } catch (err) {
      return next({ content: [{ detail: 'Malformed body' }], status: 400 });
    }

    // Validate the submitted device id to update //
    const errors = await validate(mobileRelation);
    if (errors.length > 0) {
      return next(validationErrorToHttpResponse(errors));
    }

    // Catches errors (mostly when non nullable fields are null) //
    try {
      await mobileRelation.save();
    } catch (err) {
      return next({ content: [{ detail: 'Database rejected input' }], status: 400 });
    }

    return res.status(200).send();
  }

});

export default router;
