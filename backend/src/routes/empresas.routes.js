import { Router } from 'express';

import {
    getEmpresas,
    createEmpresa,
    deleteEmpresa
} from '../controllers/empresas.controller.js';

import {
    protectWithJwt,
    verifySuperAdmin
} from '../middlewares/validateJwt.middleware.js';

const router = Router();

router
    .route('/')
    .get([protectWithJwt, verifySuperAdmin], getEmpresas)
    .post([protectWithJwt, verifySuperAdmin], createEmpresa)
    .delete([protectWithJwt, verifySuperAdmin], deleteEmpresa);


    export default router;