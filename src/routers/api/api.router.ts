import express from 'express';

import { postGoogleAuthcode } from './auth/google-authcode';
import { getGoogle } from './auth/google';
import { getGoogleRedirect } from './auth/google/redirect';

import { postCanvas } from './canvas';
import { getCanvasDocument } from './canvas/document';

const router = express.Router();

router.use('/auth/google-authcode', postGoogleAuthcode);
router.use('/auth/google', getGoogle);
router.use('/auth/google/redirect', getGoogleRedirect);

router.use('/canvas/:id', getCanvasDocument);
router.use('/canvas', postCanvas);

/** @todo improve image storage / retrieval when we reach production */
router.use('/images/canvas', express.static('uploads/canvas_images'));

export default router;
