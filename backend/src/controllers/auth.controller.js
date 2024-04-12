import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';
import { genJWT } from '../helpers/index.js';
import { createError } from '../utils/error.js';

export const signUp = async (req, res, next) => {
  try {
    const { email, password, direccion, telefono, nombre, identificacion } =
      req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        direccion,
        telefono,
        nombre,
        identificacion,
        // es_admin: true,
      },
    });
    delete user.password;

    res
      .status(201)
      .json({ ok: true, message: 'Usuario creado con éxito!', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user)
      return next(
        createError(
          401,
          'Hubo un problema al iniciar sesión. Verifique su correo electrónico y contraseña o cree una cuenta.'
        )
      );
    const matchPass = await bcryptjs.compare(password, user?.password);
    if (!matchPass)
      return next(
        createError(
          401,
          'Hubo un problema al iniciar sesión. Verifique su correo electrónico y contraseña o cree una cuenta.'
        )
      );

    delete user.password;

    // validate if is veterinarian, tutor or admin
    const isVeterinarian = await prisma.responsable.findFirst({
      where: {
        userId: user.id,
      },
    });
    const isTutor = await prisma.tutor.findFirst({
      where: {
        userId: user.id,
      },
    });
    const userBody = {
      ...user,
      es_veterinario: isVeterinarian ? true : false,
      es_tutor: isTutor ? true : false,
      ...(isVeterinarian && { responsable: isVeterinarian }),
      ...(isTutor && { tutor: isTutor }),
    };

    // Gen JWT
    const token = await genJWT(user.id);

    res.status(200).json({
      ok: true,
      message: 'Inicio de sesión exitoso!',
      user: userBody,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const renewJwt = async (req, res) => {
  const { authenticatedUser } = req;
  if (!authenticatedUser)
    res.status(401).json({ ok: false, msg: 'Unathorized!' });

  // Gen JWT
  const token = await genJWT(authenticatedUser.id);

  res.status(200).json({
    ok: true,
    token,
    user: authenticatedUser,
  });
};

export const validateEmail = async (req, res, next) => {
  const { email } = req.query;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ ok: false, message: 'Correo ya registrado' });
    }

    res.status(200).json({ ok: false, message: 'Correo no registrado' });
  } catch (error) {
    next(error);
  }
};
