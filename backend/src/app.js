import express from 'express';

import {
  errorHandler,
  notFound,
  setupMiddlewares,
} from './middlewares/index.js';
import {
  authRouter,
  freeRouter,
  pdfsRouter,
  petsRouter,
  tutorsRouter,
  usersRouter,
  veterinariansRouter,
  empresasRouter
} from './routes/index.js';
import { createSuperAdminUser } from './utils/create-admin.js';
import { createRoles } from './utils/create-roles.js';

// Initializations
const app = express();

// Create admin user if it doesn't exist
(async () => {
  await createRoles();
  await createSuperAdminUser();
})();

// Middlewares
setupMiddlewares(app);

// Router
app.use('/auth', authRouter);
app.use('/pets', petsRouter);
app.use('/users', usersRouter);
app.use('/free', freeRouter);
app.use('/pdfs', pdfsRouter);
app.use('/veterinarians', veterinariansRouter);
app.use('/tutors', tutorsRouter);
app.use('/empresas', empresasRouter);

app.use(notFound);
app.use(errorHandler);


export default app;
