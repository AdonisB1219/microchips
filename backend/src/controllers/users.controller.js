import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';

export const signUpVeterinarian = async (req, res, next) => {
  try {
    const { email, password, telefono, nombre, identificacion, no_registro, especialidad } =
      req.body;

    // validate emial
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'El correo ya ha sido registrado',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

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

    const veterinarian = await prisma.veterinario.create({
      data: {
        userId: user.id,
        especialidad: especialidad,
        no_registro: no_registro,
      },
      include: {
        user: true,
      },
    });
    delete veterinarian.user.password;
    delete user.password;
    res
      .status(201)
      .json({ ok: true, message: 'Usuario creado con éxito!', veterinarian });
  } catch (error) {
    next(error);
  }
};

export const signUpTutor = async (req, res, next) => {
  try {
    const { email, password, direccion, telefono, nombre, identificacion } =
      req.body;

    // validate emial
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'El correo ya ha sido registrado',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        direccion,
        telefono,
        nombre,
        identificacion,
        es_tutor: true,
      },
    });

    const tutor = await prisma.tutor.create({
      data: {
        userId: user.id,
        observaciones: req.body.observaciones || '',
        nombre_tutor: req.body.nombre,
      },
      include: {
        user: true,
      },
    });
    delete tutor.user.password;

    res
      .status(201)
      .json({ ok: true, message: 'Usuario creado con éxito!', tutor });
  } catch (error) {
    next(error);
  }
};

export const signUpAdmin = async (req, res, next) => {
  try {
    const { email, password, telefono, nombre, identificacion } =
      req.body;

    // validate emial
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'El correo ya ha sido registrado',
      });
    }
    console.log("authuser -> ", req.authenticatedUser);


    const empresaId = (req.authenticatedUser.rolId === 4)? req.body.empresaId : req.authenticatedUser.empresaId;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        telefono,
        nombre,
        identificacion,
        rolId: 3,
        empresaId
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

export const getAdmins = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const skip = (page - 1) * limit;
    const adminName = req.query.nombre || '';

    const admins = await prisma.user.findMany({
      where: {
        nombre: {
          contains: adminName,
        },
        es_admin: true,
        // email: {
        //   not: 'admin@admin.com',
        // },
      },
      skip: skip,
      take: limit,
    });

    const total = await prisma.user.count({
      where: {
        nombre: {
          contains: adminName,
        },
        es_admin: true,
      },
    });
    const totalPages = Math.ceil(total / limit);

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.status(200).json({
      ok: true,
      count: total,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      numero_paginas: totalPages,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
        es_admin: true,
      },
    });
    if (!admin) {
      return res
        .status(404)
        .json({ ok: false, message: 'Admin no encontrado' });
    }

    delete admin.password;
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { email, direccion, telefono, nombre, identificacion, password } =
      req.body;

    const updatedPassword = await bcryptjs.hash(password || '', 10);

    const admin = await prisma.user.update({
      where: {
        id: +req.params.id,
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
    res.status(200).json({ ok: true, admin });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await prisma.user.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(200).json({ ok: true, admin });
  } catch (error) {
    next(error);
  }
};
