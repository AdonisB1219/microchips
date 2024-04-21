import { Router } from 'express';

import {
    getEmpresas,
    createEmpresa,
    deleteEmpresa,
    updateEmpresa,
    getEmpresa
} from '../controllers/empresas.controller.js';

import {
    protectWithJwt,
    verifySuperAdmin
} from '../middlewares/validateJwt.middleware.js';

const router = Router();

router
    .route('/')
    .get([protectWithJwt, verifySuperAdmin], getEmpresas)
    .post([protectWithJwt, verifySuperAdmin], createEmpresa);

router
    .route('/:id')
    .put([protectWithJwt, verifySuperAdmin], updateEmpresa)
    .delete([protectWithJwt, verifySuperAdmin], deleteEmpresa)
    .get([protectWithJwt, verifySuperAdmin], getEmpresa);



    export default router;