import { Router } from 'express';

import {
  deleteAdmin,
  getAdmin,
  getAdmins,
  signUpAdmin,
  updateAdmin,
} from '../controllers/index.js';
import {
  createVeterinarianAdminRules,
} from '../middlewares/index.js';
import {
  protectWithJwt,
  verifyAdmin,
} from '../middlewares/validateJwt.middleware.js';

const router = Router();


router
  .route('/administradores')
  .get([protectWithJwt, verifyAdmin], getAdmins)
  .post(
    [protectWithJwt, verifyAdmin, createVeterinarianAdminRules()],
    signUpAdmin
  );

router
  .route('/administradores/:id')
  .get([protectWithJwt, verifyAdmin], getAdmin)
  .put([protectWithJwt, verifyAdmin], updateAdmin)
  .delete([protectWithJwt, verifyAdmin], deleteAdmin);




export default router;
