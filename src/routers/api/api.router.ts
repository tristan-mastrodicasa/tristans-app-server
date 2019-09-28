import express from 'express';

/* tslint:disable */

/** @todo if variable clashes disable import-name tslint rule form microsoft-contrib */
import authGoogleAuthcode from './auth/google-authcode';
import authGoogle from './auth/google';
import authGoogleRedirect from './auth/google/redirect';

import authTest from './auth/test';
import authTestUnprotected from './auth/test/unprotected';

import canvases from './canvases';
import canvasesDocument from './canvases/document';

/* tslint:enable */

const router = express.Router();

router.use('/auth/google-authcode', authGoogleAuthcode);
router.use('/auth/google', authGoogle);
router.use('/auth/google/redirect', authGoogleRedirect);

router.use('/auth/test', authTest);
router.use('/auth/test/unprotected', authTestUnprotected);

router.use('/canvases', canvases);
router.use('/canvases/:id', canvasesDocument);

/** @todo improve image storage / retrieval when we reach production */
router.use('/images/canvas', express.static('uploads/canvas_images'));

export default router;
