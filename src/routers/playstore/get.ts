import { Router } from 'express';

const router = Router();

router.get('/', (_req, res, _next) => {
  // Middleware in the configuration will log this redirect //
  res.redirect('https://play.google.com/store/apps/details?id=com.tristans.app');
});

export default router;
