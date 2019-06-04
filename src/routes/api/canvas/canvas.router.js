import { Router } from 'express';

import {
  getCanvas,
  postCanvas,
} from './controllers/canvas.controller';

const router = new Router();

// Get Routes
router.get('/', getCanvas);

// Post routes
router.post('/', postCanvas);

export default router;
