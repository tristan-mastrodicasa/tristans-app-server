import { Router } from 'express';

import {
  getMemes,
  getMemeById,
  postMeme,
  postUpdateMemeById,
  deleteMemeById,
} from './controllers/meme.controller';

const router = new Router();

// Get Routes
router.get('/', getMemes);
router.get('/:id', getMemeById);

// Post routes
router.post('/', postMeme);
router.post('/:id', postUpdateMemeById);

// Delete routes
router.delete('/:id', deleteMemeById);

export default router;
