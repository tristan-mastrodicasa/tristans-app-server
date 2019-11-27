import express from 'express';
import apiRouter from './api/api.router';
import index from './';
import privacy from './privacy';
import terms from './terms';
import support from './support';
import canvas from './canvas';
import playstore from './playstore';
import influencers from './influencers';

const router = express.Router();

router.use('/api', apiRouter);

router.use('/', index.get);
router.use('/privacy', privacy.get);
router.use('/terms', terms.get);
router.use('/support', support.get);
router.use('/canvas', canvas.get);
router.use('/playstore', playstore.get);
router.use('/influencers', influencers.get);

router.use('/', express.static('assets'));

export default router;
