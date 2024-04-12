import { Router } from 'express';

import { getPetsFree, searchPets } from '../controllers/free.controller.js';

const router = Router();

router.route('/pets').get(getPetsFree);
router.get('/search', searchPets);

export default router;
