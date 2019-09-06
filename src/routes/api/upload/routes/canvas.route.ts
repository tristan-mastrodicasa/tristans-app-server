import { Router } from 'express';
import multer from 'multer';
// import passport from 'passport';

const router = Router();

const upload = multer({ dest: 'uploads/canvas_images/', limits: { fileSize: 5000000, files: 1 } });

router.post('/', upload.single('file'), (req, res) => {

  if (req.file) {

    res.json(req.file);

  } else throw { content: [{ detail: 'Something went wrong' }], status: 500 };

});

export default router;
