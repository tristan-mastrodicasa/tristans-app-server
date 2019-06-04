import { Router } from 'express';

import { getUsers } from './controllers/user.controller';

const router = new Router();

// Get Routes
router.get('/', getUsers);

// Post routes


export default router;
