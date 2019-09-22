import express from 'express';

/* tslint:disable */

/** @todo if variable clashes disable import-name tslint rule form microsoft-contrib */
import authGoogleAuthcode from './auth/google-authcode';
import authGoogle from './auth/google';
import authGoogleRedirect from './auth/google/redirect';

import authTest from './auth/test';
import authTestUnprotected from './auth/test/unprotected';

import canvas from './canvas';
import canvasDocument from './canvas/document';

/* tslint:enable */

const router = express.Router();

router.use('/auth/google-authcode', authGoogleAuthcode);
router.use('/auth/google', authGoogle);
router.use('/auth/google/redirect', authGoogleRedirect);

router.use('/auth/test', authTest);
router.use('/auth/test/unprotected', authTestUnprotected);

router.use('/canvas', canvas);
router.use('/canvas/:id', canvasDocument);

router.use('/images/canvas', express.static('uploads/canvas_images')); /** @todo improve image storage when we reach production */

export default router;
