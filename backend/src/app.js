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
} from './routes/index.js';
import { createAdminUser } from './utils/create-admin.js';

// Initializations
const app = express();

// Create admin user if it doesn't exist
(async () => {
  await createAdminUser();
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

app.use(notFound);
app.use(errorHandler);

export default app;
