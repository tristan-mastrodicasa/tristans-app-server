import { Router } from 'express';

const router = Router();

router.get('/', (_req, res, _next) => {
  res.render('pages/privacy');
});

export default router;
