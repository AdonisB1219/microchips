import jwt from 'jsonwebtoken';

import { SECRETORPRIVATEKEY_JWT } from '../config/index.js';
import { prisma } from '../db/mysql/index.js';
import { createError } from '../utils/error.js';

export const protectWithJwt = async (req, res, next) => {
  const bearerToken = req.header('Authorization');
  if (!bearerToken || !bearerToken.startsWith('Bearer'))
    return res.status(401).json({ ok: false, msg: 'Invalid token!' });

  const tokenJwt = bearerToken.split(' ')[1];

  try {
    const { id } = jwt.verify(tokenJwt, SECRETORPRIVATEKEY_JWT);
    console.log("verify token", id);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Empresa: true
      }
    });

    if (!user)
      return res.status(401).json({ ok: false, msg: 'Invalid token!' });

    req.authenticatedUser = user;


    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, msg: 'Invalid token!' });
  }
};

export const verifyAdmin = (req, _res, next) => {
  if (!req.authenticatedUser.id)
    return next(
      createError(403, 'No tienes permisos para realizar esta acción')
    );

  const { rolId } = req.authenticatedUser;

  if (rolId > 2) return next();

  return next(createError(403, 'No tienes permisos para realizar esta acción'));
};

export const isAdminOrVeterinarian = (req, _res, next) => {
  if (!req.authenticatedUser.id)
    return next(
      createError(403, 'No tienes permisos para realizar esta acción')
    );

  const { rolId } = req.authenticatedUser;

  if (rolId > 1) return next();

  return next(createError(403, 'No tienes permisos para realizar esta acción'));
};

export const verifySuperAdmin = (req, _res, next) => {
  if (!req.authenticatedUser.id)
    return next(
      createError(403, 'No tienes permisos para realizar esta acción')
    );

  const { rolId } = req.authenticatedUser;

  if (rolId > 3) return next();

  return next(createError(403, 'No tienes permisos para realizar esta acción'));
};
