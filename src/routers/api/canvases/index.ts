import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { ValidationError } from 'class-validator';
import passport from 'passport';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasUploaded, EVisibility } from 'shared/models';
import { createNewCanvas } from 'shared/helpers';

const router = Router();

// File upload initalization //
const upload = multer({
  dest: 'uploads/canvas_images/',
  limits: { fileSize: 1500000, files: 1 },
  fileFilter: (_req, file, cb) => {

    // Make sure only images are uploaded //
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return cb(null, true);
    }

    return cb(new Error('Only jpg and png files allowed'), false);

  },
}).single('canvas');

/**
 * @api {post} /canvases Create a new canvas
 * @apiName CreateCanvas
 * @apiGroup Canvases
 *
 * @apiParam {String} description The description of the canvas
 *
 * @apiSuccess {String} canvasId The id of the new canvas
 *
 * @apiError (HTTP Error Codes) 400 Validation error
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

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

        return next({
          content: err.map((value: ValidationError) => {

            return { title: value.property, detail: value.constraints[Object.keys(value.constraints)[0]] };

          }),
          status: 400,
        });

      }

      const canvasId: CanvasUploaded = { canvasId: canvasRecord.id };
      return res.json(canvasId);

    }

    return next({ content: [{ title: 'file', detail: 'File is missing' }], status: 400 });

  });

});

export default router;
