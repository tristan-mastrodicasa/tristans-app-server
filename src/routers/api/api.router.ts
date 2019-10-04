import express from 'express';

import auth from './auth';
import canvas from './canvas';
import meme from './meme';

const router = express.Router();

router.use('/auth/google-authcode', auth.googleAuthcode.post);
router.use('/auth/google', auth.google.get);
router.use('/auth/google/redirect', auth.google.redirect.get);

router.use('/meme', meme.post);
router.use('/meme/:id', meme.document.del);

router.use('/canvas/:id/star', canvas.document.star.post);
router.use('/canvas/:id/star', canvas.document.star.del);

router.use('/canvas/:id', canvas.document.get);
router.use('/canvas/:id', canvas.document.del);
router.use('/canvas', canvas.post);

/** @todo improve image storage / retrieval when we reach production */
router.use('/images/canvas', express.static('uploads/canvas_images'));

export default router;
