import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import passport from 'passport';
import { Canvas } from 'database/entities/canvas.entity';
import { EVisibility } from 'shared/models';
import { createNewCanvas, validationErrorToHttpResponse } from 'shared/helpers';
import env from 'conf/env';

const router = Router();

// File upload initalization //
const upload = multer({
  storage: env.multerFileStorageEngine(env.awsS3Buckets.canvas),
  limits: { fileSize: 1000000, files: 1 },
  fileFilter: (_req, file, cb) => {

    // Make sure only images are uploaded //
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return cb(null, true);
    }

    return cb(new Error('Only jpg and png files allowed'), false);

  },
}).single('canvas');

/**
 * @api {post} /canvas Create a new canvas
 * @apiName CreateCanvas
 * @apiGroup Canvas
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {String} description The description of the canvas
 *
 * @apiSuccess (201) {String} canvasId The id of the new canvas
 *
 * @apiError (HTTP Error Codes) 400 Validation error
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  /** @todo Fix known bug where image is uploaded even if validation fails for other inputs */
  /** @todo enable daily rate limiting */
  upload(req, res, async (err) => {
    if (err instanceof Error) return next({ content: [{ title: 'file', detail: err.message }], status: 400 });
    if (err) return next({ content: [{ title: 'file', detail: 'Something went wrong' }], status: 400 });

    if (req.file) {

      // Create the canvas record //
      const canvas = new Canvas();
      canvas.description = (req.body.description ? req.body.description : null);
      canvas.imagePath = req.file.filename;
      canvas.mimetype = req.file.mimetype;
      canvas.visibility = EVisibility.public; // Only public to start
      canvas.uniqueKey = crypto.randomBytes(32).toString('hex');

      let canvasRecord: Canvas;

      try {
        canvasRecord = await createNewCanvas(canvas, req.user.id);
      } catch (err) {

        return next(validationErrorToHttpResponse(err));

      }

      return res.status(201).json({ canvasId: canvasRecord.id });

    }

    return next({ content: [{ title: 'file', detail: 'File is missing' }], status: 400 });

  });

});

export default router;
