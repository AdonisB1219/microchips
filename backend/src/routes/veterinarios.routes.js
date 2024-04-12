import { Router } from 'express';

import { signUpVeterinarian } from '../controllers/users.controller.js';
import {
  deleteVeterinarian,
  getVeterinarian,
  getVeterinarians,
  updateVeterinarian,
} from '../controllers/veterinarians.controller.js';
import {
  protectWithJwt,
  verifyAdmin,
} from '../middlewares/validateJwt.middleware.js';
import { createVeterinarianRules } from '../middlewares/validator.middleware.js';

const router = Router();

router
  .route('/')
  .get([protectWithJwt, verifyAdmin], getVeterinarians)
  .post(
    [protectWithJwt, verifyAdmin, createVeterinarianRules()],
    signUpVeterinarian
  );

router
  .route('/:id')
  .get([protectWithJwt, verifyAdmin], getVeterinarian)
  .put([protectWithJwt, verifyAdmin], updateVeterinarian)
  .delete([protectWithJwt, verifyAdmin], deleteVeterinarian);

export default router;
