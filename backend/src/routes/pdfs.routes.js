import { Router } from 'express';

import { pdfPet } from '../controllers/pdfs.controller.js';
import {
    isAdminOrVeterinarian,
    protectWithJwt,
  } from '../middlewares/validateJwt.middleware.js';
const router = Router();

router.route('/pet/:id')
.get([protectWithJwt], pdfPet);


export default router;
