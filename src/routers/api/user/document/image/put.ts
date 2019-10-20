import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
import { User } from 'database/entities/user.entity';
import expressRateLimit from 'express-rate-limit';

const router = Router({ mergeParams: true });

// File upload initalization //
const upload = multer({
  dest: 'uploads/user_images/',
  limits: { fileSize: 1500000, files: 1 },
  fileFilter: (_req, file, cb) => {

    // Make sure only images are uploaded //
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return cb(null, true);
    }

    return cb(new Error('Only jpg and png files allowed'), false);

  },
}).single('user_image');

/**
 * @api {put} /user/:id/image Change the image for a user
 * @apiName EditUserProfileImage
 * @apiGroup User
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {Number} id The id of the user
 * @apiParam {Object} user_image The new profile image
 *
 * @apiError (HTTP Error Codes) 401 Unauthorized
 * @apiError (HTTP Error Codes) 429 Rate limited
 * @apiError (HTTP Error Codes) 400 Missing file / File sucks
 */
router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  expressRateLimit({
    windowMs: 1440 * 60 * 1000, // 1 day
    max: 10,
    keyGenerator: (req, _res) => {
      return req.user.id; // rate limit user id
    },
  }),
  (req, res, next) => {

    // If the user does not own this profile  //
    if (req.user.id !== +req.params.id) return next({ content: [{ detail: 'Cannot modify profile image' }], status: 401 });

    /** @todo Fix known bug where image is uploaded even if validation fails for other inputs */
    upload(req, res, async (err) => {
      if (err instanceof Error) return next({ content: [{ title: 'file', detail: err.message }], status: 400 });
      if (err) return next({ content: [{ title: 'file', detail: 'Something went wrong' }], status: 400 });

      const user = await User.findOne(req.user.id);

      if (req.file) {

        user.profileImg = req.file.filename;
        user.profileImgMimeType = req.file.mimetype;
        await user.save();

        return res.status(200).send();

      }

      return next({ content: [{ title: 'file', detail: 'File is missing' }], status: 400 });

    });
  },
);

export default router;
