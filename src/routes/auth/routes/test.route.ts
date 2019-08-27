import { Router } from 'express';
import { authCheck } from '../../../utils/auth-check.util';

const router = Router();

router.get('/', authCheck, (req, res) => {

  res.send('You made it! ' + req.user.username);

});

export default router;
