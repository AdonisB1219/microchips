import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';
import { filter } from 'compression';

export const getVeterinarians = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const search = req.query?.nombre;
    const skip = (page - 1) * limit;
    console.log(req.authenticatedUser);

    const empresaId = req.authenticatedUser.empresaId;
    const userIsSuperAdmin = req.authenticatedUser.es_superadmin;

    const filterOptions = {
      user: {
        nombre: {
          contains: search,
        },
      },
    };

    if (!userIsSuperAdmin) {
      filterOptions.user.empresaId = empresaId;
    }


    const veterinarians = await prisma.veterinario.findMany({
      skip: skip,
      take: limit,
      where: filterOptions,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            identificacion: true,
            telefono: true,
            email: true,
            Empresa: true
          },
        },
      },
    });

    const totalVeterinarians = await prisma.veterinario.count({
      where: filterOptions
    });
    const totalPages = Math.ceil(totalVeterinarians / limit);

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.status(200).json({
      ok: true,
      count: totalVeterinarians,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      numero_paginas: totalPages,
      data: veterinarians,
    });
  } catch (error) {
    next(error);
  }
};

export const getVeterinarian = async (req, res, next) => {

  const empresa = req.authenticatedUser.empresaId;
    const userIsSuperAdmin = req.authenticatedUser.es_superadmin;

    const filterOptions = {
      id: parseInt(id),
    }

    if (!userIsSuperAdmin) {
      filterOptions.user.empresaId = empresa;
    }

  const { id } = req.params;
  try {
    const veterinarian = await prisma.veterinario.findUnique({
      where: filterOptions,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            identificacion: true,
            direccion: true,
            telefono: true,
            email: true,
          },
        },
      },
    });

    if (!veterinarian)
      return res
        .status(404)
        .json({ ok: false, msg: 'Veterinario no encontrado' });

    res.status(200).json(veterinarian);
  } catch (error) {
    next(error);
  }
};

export const createVeterinarian = async (req, res, next) => {
  const { email, password, telefono, nombre, identificacion, no_registro, especialidad } =
    req.body;

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    // validate if email already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists)
      return res
        .status(400)
        .json({ ok: false, message: 'El correo ya está en uso' });

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        telefono,
        nombre,
        identificacion,
        rolId: 2,
      },
    });
    delete user.password;

    console.log("auth user -> ", req.authenticatedUser)

    // create veterinarian/responsable
    await prisma.veterinario.create({
      data: {
        userId: user?.id,
        no_registro,
        especialidad,
        empresaId: req.authenticatedUser.empresaId
      },
    });

    res
      .status(201)
      .json({ ok: true, message: 'Veterinario creado con éxito!', user });
  } catch (error) {
    next(error);
  }
};

export const updateVeterinarian = async (req, res, next) => {
  const { id } = req.params;
  const { email, direccion, telefono, nombre, identificacion, password } =
    req.body;

  try {
    // update user based on responsableId
    const veterinarian = await prisma.veterinario.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        userId: true,
      },
    });

    const updatedPassword = await bcryptjs.hash(password || '', 10);

    const user = await prisma.user.update({
      where: {
        id: veterinarian.userId,
      },
      data: {
        email,
        direccion,
        telefono,
        nombre,
        identificacion,
        ...(password && { password: updatedPassword }),
      },
    });
    delete user.password;

    res
      .status(200)
      .json({ ok: true, message: 'Veterinario actualizado con éxito!', user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteVeterinarian = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  try {
    const veterinarian = await prisma.veterinario.findUnique({
      where: {
        id: +id,
      },
    });
    if (!veterinarian)
      return res
        .status(404)
        .json({ ok: false, message: 'Veterinario no encontrado' });

    await prisma.user.delete({
      where: {
        id: veterinarian.userId,
      },
    });

    res
      .status(200)
      .json({ ok: true, message: 'Veterinario eliminado con éxito!' });
  } catch (error) {
    next(error);
  }
};
