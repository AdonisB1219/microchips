import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';

export const getVeterinarians = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const search = req.query?.nombre;
    const skip = (page - 1) * limit;

    const empresaId = req.authenticatedUser.empresaId;
    const userRole = req.authenticatedUser.rolId;

    const filterOptions = {
      user: {
        nombre: {
          contains: search,
        },
      },
    };

    if (userRole != 4) {
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

  const { id } = req.params;
  try {
    const veterinarian = await prisma.veterinario.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            identificacion: true,
            empresaId: true,
            telefono: true,
            email: true,
          },
        },
      },
    });

    if (!veterinarian) {
      return res
        .status(404)
        .json({ ok: false, msg: 'Veterinario no encontrado' });
    }

    if (req.authenticatedUser.empresaId != veterinarian.user.empresaId && req.authenticatedUser.rolId != 4) {
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }


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
        empresaId: req.authenticatedUser.empresaId
      },
    });
    delete user.password;

    await prisma.veterinario.create({
      data: {
        userId: user?.id,
        no_registro,
        especialidad,
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
  const { email, telefono, nombre, identificacion, password } =
    req.body;

  try {
    // update user based on responsableId
    const veterinarian = await prisma.veterinario.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            rolId: true,
            empresaId: true
          }
        },
      },
    });

    if (req.authenticatedUser.empresaId != veterinarian.user.empresaId && req.authenticatedUser.rolId != 4) {
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }

    const updatedPassword = await bcryptjs.hash(password || '', 10);

    const user = await prisma.user.update({
      where: {
        id: veterinarian.userId,
      },
      data: {
        email,
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

  try {
    const veterinarian = await prisma.veterinario.findUnique({
      where: {
        id: +id,
      },
      include: {
        user: {
          select: {
            rolId: true,
            empresaId: true,
            email: true
          }
        },
      },
    });
    if (!veterinarian) {
      return res
        .status(404)
        .json({ ok: false, message: 'Veterinario no encontrado' });
    }


    if (req.authenticatedUser.empresaId != veterinarian.user.empresaId && req.authenticatedUser.rolId != 4) {
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }
    await prisma.user.delete({
      where: {
        id: veterinarian.userId,
      },
    });

    
    await prisma.onDeleteLogs.create({
      data: {
          descripcion: `El veterinario ${veterinarian.userId} - ${veterinarian.user.email} fue eliminado por el usuario ${req.authenticatedUser.id} - ${req.authenticatedUser.email}`
      }
  });

    res
      .status(200)
      .json({ ok: true, message: 'Veterinario eliminado con éxito!' });
  } catch (error) {
    next(error);
  }
};
