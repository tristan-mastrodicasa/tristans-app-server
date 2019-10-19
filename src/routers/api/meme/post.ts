import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
// import crypto from 'crypto';
import { Meme } from 'database/entities/meme.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { createNewMeme, validationErrorToHttpResponse } from 'shared/helpers';

const router = Router();

// File upload initalization //
/*const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/meme_images/');
  },
  filename: (_req, file, cb) => {
    if (file.mimetype === 'image/jpeg') cb(null, `${crypto.randomBytes(16).toString('hex')}.jpg`);
    if (file.mimetype === 'image/png') cb(null, `${crypto.randomBytes(16).toString('hex')}.png`);
  },
});*/

const upload = multer({
  // storage,
  dest: 'uploads/meme_images/',
  limits: { fileSize: 1500000, files: 1 },
  fileFilter: (_req, file, cb) => {

    // Make sure only images are uploaded //
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return cb(null, true);
    }

    return cb(new Error('Only jpg and png files allowed'), false);

  },
}).single('meme');

/** @todo restrict 3 memes per canvas, add unit test */

/**
 * @api {post} /meme Create a new meme
 * @apiName CreateMeme
 * @apiGroup Meme
 *
 * @apiHeader Authorization Bearer [token]
 *
 * @apiParam {String} canvasid The id of the host canvas
 * @apiParam {File} meme The meme to upload
 *
 * @apiSuccess (201) {String} memeId The id of the new meme
 *
 * @apiError (HTTP Error Codes) 400 Validation error
 * @apiError (HTTP Error Codes) 401 Unauthorized
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  if (!req.query.canvasid) return next({ content: [{ detail: 'Please pass a canvas id in the query' }], status: 400 });

  /** @todo Fix known bug where image is uploaded even if validation fails for other inputs */
  upload(req, res, async (err) => {
    if (err instanceof Error) return next({ content: [{ title: 'file', detail: err.message }], status: 400 });
    if (err) return next({ content: [{ title: 'file', detail: 'Something went wrong' }], status: 400 });

    const canvas = await Canvas.findOne(req.query.canvasid);
    if (!canvas) return next({ content: [{ detail: 'The canvas id you passed did not match one in the database' }], status: 400 });

    if (req.file) {

      // Create the canvas record //
      const meme = new Meme();
      meme.imagePath = req.file.filename;
      meme.mimetype = req.file.mimetype;

      let memeRecord: Meme;

      try {
        memeRecord = await createNewMeme(meme, canvas.id, req.user.id);
      } catch (err) {

        return next(validationErrorToHttpResponse(err));

      }

      return res.status(201).json({ memeId: memeRecord.id });

    }

    return next({ content: [{ title: 'file', detail: 'File is missing' }], status: 400 });

  });

});

export default router;
