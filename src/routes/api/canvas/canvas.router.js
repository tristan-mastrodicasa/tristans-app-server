import { Router } from 'express';

import { getCanvas } from './controllers/canvas.controller';

const router = new Router();

// Get Routes
router.get('/', getCanvas);

// Post routes


export default router;
