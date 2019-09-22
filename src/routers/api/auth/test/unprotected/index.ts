import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {

  console.log('unprotected route accessed');
  res.send('You have accessed an unprotected route');

});

export default router;
