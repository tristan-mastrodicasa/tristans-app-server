import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { validate } from 'class-validator';
// import passport from 'passport';

import { Canvas } from 'database/entities/canvas.entity';
import { CanvasUploaded, EVisibility } from 'shared/models';

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

    return cb(new Error('Only image files are allowed!'), false);

  },
});

/** @todo API Doc */
router.post('/', upload.single('canvas'), (req, res, next) => {

  if (req.file) {

    console.log(req.file);

    const canvas = new Canvas();
    canvas.description = ('description' in req.body && req.body.description ? req.body.description : null);
    canvas.imagePath = req.file.filename;
    canvas.mimetype = req.file.mimetype;
    canvas.visibility = EVisibility.followBacks; // Only followbacks to start
    canvas.publicAccessKey = crypto.randomBytes(32).toString('hex');

    validate(canvas).then((errors) => {

      if (errors.length > 0) {

        return next({
          content: errors.map((value, _index, _array) => {

            return { title: value.property, detail: value.constraints[Object.keys(value.constraints)[0]] };

          }),
          status: 400,
        });

      }

      console.log('"validation succeed"');

      /** @todo Validate that the user has uploaded less than 6 canvases a day */
      canvas.save().then((canvasRecord: Canvas) => {

        console.log(`new canvas is: ${canvasRecord.id}`);

        const canvasId: CanvasUploaded = { canvasId: canvasRecord.id };
        res.json(canvasId);

      });

    });

  } else throw { content: [{ detail: 'Something went wrong' }], status: 400 };

});

export default router;
