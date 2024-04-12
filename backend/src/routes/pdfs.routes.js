import { Router } from 'express';

import { pdfPet } from '../controllers/pdfs.controller.js';

const router = Router();

router.route('/pet/:id').get(pdfPet);

export default router;
