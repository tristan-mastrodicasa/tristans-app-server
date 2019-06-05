import { Router } from 'express';

import {
  getCanvas,
  getCanvasById,
  postCanvas,
  postUpdateCanvasById,
  deleteCanvasById,
} from './controllers/canvas.controller';

const router = new Router();

// Get Routes
router.get('/', getCanvas);
router.get('/:id', getCanvasById);

// Post routes
router.post('/', postCanvas);
router.post('/:id', postUpdateCanvasById);

// Delete routes
router.delete('/:id', deleteCanvasById);

export default router;
