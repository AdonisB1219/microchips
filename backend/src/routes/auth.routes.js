import { Router } from 'express';
import {
  login,
  renewJwt,
} from '../controllers/index.js';
import {
  loginRules,
  protectWithJwt,
} from '../middlewares/index.js';

const router = Router();

router.post('/login', loginRules(), login);
//router.post('/registro', signUpRules(), signUp);
//router.get('/validate-email', protectWithJwt, validateEmail);

router.get('/renew', protectWithJwt, renewJwt);

export default router;
