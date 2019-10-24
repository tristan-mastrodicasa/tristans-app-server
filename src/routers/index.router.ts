import express from 'express';
import apiRouter from './api/api.router';
import index from './';
import privacy from './privacy';
import terms from './terms';
import support from './support';
import canvas from './canvas';

const router = express.Router();

router.use('/api', apiRouter);

router.use('/', index.get);
router.use('/privacy', privacy.get);
router.use('/terms', terms.get);
router.use('/support', support.get);
router.use('/canvas', canvas.get);

router.use('/css', express.static('assets/css'));
router.use('/img', express.static('assets/img'));
router.use('/js', express.static('assets/js'));
router.use('/fonts', express.static('assets/fonts'));

export default router;
