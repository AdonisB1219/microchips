import { Router } from 'express';

import {
  deleteTutor,
  getAllTutores,
  getTutor,
  getTutores,
  updateTutor,
} from '../controllers/tutores.controller.js';
import { signUpTutor } from '../controllers/users.controller.js';
import {
  isAdminOrVeterinarian,
  protectWithJwt,
  verifyAdmin,
} from '../middlewares/validateJwt.middleware.js';

const router = Router();

router
  .route('/')
  .get([protectWithJwt], getTutores)
  .post([protectWithJwt, isAdminOrVeterinarian], signUpTutor);

router
  .route('/:id')
  .get([protectWithJwt, verifyAdmin], getTutor)
  .put([protectWithJwt, verifyAdmin], updateTutor)
  .delete([protectWithJwt, verifyAdmin], deleteTutor);

router.route('/get/all-tutores').get([protectWithJwt, verifyAdmin], getAllTutores);


export default router;
