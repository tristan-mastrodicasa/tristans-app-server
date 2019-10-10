import express from 'express';

import auth from './auth';
import canvas from './canvas';
import meme from './meme';
import user from './user';

const router = express.Router();

router.use('/auth/google-authcode', auth.googleAuthcode.post);
router.use('/auth/google', auth.google.get);
router.use('/auth/google/redirect', auth.google.redirect.get);

router.use('/user', user.get);
router.use('/user/:id', user.document.get);
router.use('/user/:id', user.document.put);
router.use('/user/:id/content-cards', user.document.contentCards.get);
router.use('/user/:id/settings', user.document.settings.get);
router.use('/user/:id/settings', user.document.settings.put);
router.use('/user/:id/image', user.document.image.put);
router.use('/user/:id/follow', user.document.follow.post);
router.use('/user/:id/unfollow', user.document.unfollow.post);
router.use('/user/:id/followers', user.document.followers.get);
router.use('/user/:id/following', user.document.following.get);

router.use('/meme', meme.post);
router.use('/meme/:id', meme.document.del);
router.use('/meme/:id/star', meme.document.star.post);
router.use('/meme/:id/star', meme.document.star.del);

router.use('/canvas/:id/star', canvas.document.star.post);
router.use('/canvas/:id/star', canvas.document.star.del);
router.use('/canvas/:id/memes', canvas.document.memes.get);
router.use('/canvas/:id', canvas.document.get);
router.use('/canvas/:id', canvas.document.del);
router.use('/canvas', canvas.post);

/** @todo improve image storage / retrieval when we reach production */
router.use('/canvas/image', express.static('uploads/canvas_images'));
router.use('/meme/image', express.static('uploads/meme_images'));
router.use('/user/image', express.static('uploads/user_images'));

export default router;
