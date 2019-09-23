import { Router } from 'express';

const router = Router();

/**
 * @api {get} /auth/test/unprotected A normal unprotected route
 * @apiName GetUnprotectedRoute
 * @apiGroup Authentication Test
 */
router.get('/', (_req, res) => {

  console.log('unprotected route accessed');
  res.send('You have accessed an unprotected route');

});

export default router;
