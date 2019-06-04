import { Router } from 'express';

import { getMemeById, getMemes } from './controllers/meme.controller';

const router = new Router();

// Get Routes
router.get('/:id', getMemeById);
router.get('/', getMemes);

// Post routes


export default router;
