import { Router } from 'express';

import {
  createPet,
  deletePet,
  getAllPets,
  getMyPets,
  getPet,
  getPets,
  updatePet,
} from '../controllers/pets.controller.js';
import {
  isAdminOrVeterinarian,
  protectWithJwt,
  verifyAdmin,
} from '../middlewares/validateJwt.middleware.js';
import { createPetRules } from '../middlewares/validator.middleware.js';

const router = Router();

router
  .route('/')
  .post([protectWithJwt, isAdminOrVeterinarian, ...createPetRules()], createPet)
  .get([protectWithJwt, isAdminOrVeterinarian], getPets);

router.route('/my-pets').get(protectWithJwt, getMyPets);
router.route('/get/all-pets').get([protectWithJwt, verifyAdmin], getAllPets);

router
  .route('/:id')
  .get([protectWithJwt, isAdminOrVeterinarian], getPet)
  .put([protectWithJwt, isAdminOrVeterinarian], updatePet)
  .delete([protectWithJwt, verifyAdmin], deletePet);


export default router;
