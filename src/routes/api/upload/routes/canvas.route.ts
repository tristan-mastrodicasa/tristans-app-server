import { Router } from 'express';
import multer from 'multer';
// import passport from 'passport';

import { CanvasUploaded } from '../../../../models/response.interfaces';

const router = Router();

const upload = multer({ dest: 'uploads/canvas_images/', limits: { fileSize: 7000000, files: 1 } });

router.post('/', upload.single('file'), (req, res) => {

  if (req.file) {

    const canvasId: CanvasUploaded = { canvasId: 7 };
    res.json(canvasId);

  } else throw { content: [{ detail: 'Something went wrong' }], status: 500 };

});

export default router;
