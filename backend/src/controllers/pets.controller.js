/* eslint-disable indent */
import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';

export const getPets = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const skip = (page - 1) * limit;
    const nombre_mascota = req.query?.nombre_mascota;
    const nombre_tutor = req.query?.nombre_tutor;

    const pets = await prisma.mascota.findMany({
      skip: skip,
      take: limit,
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: nombre_mascota,
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: nombre_tutor,
                },
              },
            },
          },
        ],
      },

      include: {
        Tutor: {
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
        },
        Responsable: {
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
        },
      },
    });

    const totalPets = await prisma.mascota.count({
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: nombre_mascota,
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: nombre_tutor,
                },
              },
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalPets / limit);

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.status(200).json({
      ok: true,
      count: totalPets,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      numero_paginas: totalPages,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPets = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const skip = (page - 1) * limit;
    const nombre_mascota = req.query?.nombre_mascota;

    const tutor = await prisma.tutor.findFirst({
      where: {
        userId: req.authenticatedUser.id,
      },
    });

    if (!tutor) {
      return res
        .status(404)
        .json({ ok: false, message: 'Tutor no encontrado' });
    }

    const pets = await prisma.mascota.findMany({
      where: {
        // by tutorId and by query term
        AND: [
          {
            tutorId: tutor.id,
          },
          {
            nombre_mascota: {
              contains: nombre_mascota,
            },
          },
        ],
      },
      skip: skip,
      take: limit,
      include: {
        Tutor: {
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
        },
        Responsable: {
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
        },
      },
    });

    const totalPets = await prisma.mascota.count({
      where: {
        AND: [
          {
            tutorId: tutor.id,
          },
          {
            nombre_mascota: {
              contains: nombre_mascota,
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalPets / limit);

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.status(200).json({
      ok: true,
      count: totalPets,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      numero_paginas: totalPages,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getPet = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pet = await prisma.mascota.findUnique({
      where: {
        id: +id,
      },
      include: {
        Tutor: {
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
        },
        Responsable: {
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
        },
      },
    });

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  const {
    nombre_mascota,
    codigo_chip,
    lugar_implantacion,
    fecha_implantacion,
    especie,
    raza,
    sexo,
    ubicacion,
    esterilizado,
    aga,
    tutorId,
    observaciones,
    fecha_nacimiento,
  } = req.body;

  let userTutor;
  let tutor;
  let pet;

  try {
    // already exists codigo_chip
    const petExists = await prisma.mascota.findFirst({
      where: {
        codigo_chip,
      },
    });
    if (petExists) {
      return res.status(400).json({
        ok: false,
        message: 'Mascota ya registrada con ese código microchip',
      });
    }

    if (!tutorId) {
      // already exists tutor
      const tutorExists = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (tutorExists) {
        return res
          .status(400)
          .json({ ok: false, message: 'Tutor ya registrado con ese email' });
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 10);

      userTutor = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          nombre: req.body.nombre,
          identificacion: req.body.identificacion,
          es_tutor: true,
        },
      });

      tutor = await prisma.tutor.create({
        data: {
          userId: userTutor?.id,
          observaciones: observaciones || '',
          nombre_tutor: req.body.nombre,
        },
      });
    }

    const responsable = await prisma.responsable.findFirst({
      where: {
        userId: req.authenticatedUser.id,
      },
    });

    pet = await prisma.mascota.create({
      data: {
        nombre_mascota,
        codigo_chip,
        lugar_implantacion,
        fecha_implantacion,
        fecha_nacimiento,
        especie,
        raza,
        sexo,
        ubicacion,
        esterilizado,
        aga: aga || req.body?.aga,
        tutorId: tutorId || tutor?.id,
        responsableId: responsable?.id,
      },
    });

    res.status(201).json({ ok: true, pet });
  } catch (error) {
    if (pet) {
      await prisma.mascota.delete({ where: { id: pet?.id } });
    }
    if (tutor) {
      await prisma.tutor.delete({ where: { id: tutor?.id } });
    }
    if (userTutor) {
      await prisma.user.delete({ where: { id: userTutor?.id } });
    }
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  const { id } = req.params;
  const {
    nombre_mascota,
    codigo_chip,
    lugar_implantacion,
    fecha_implantacion,
    fecha_nacimiento,
    especie,
    raza,
    sexo,
    ubicacion,
    esterilizado,
    tutorId,
  } = req.body;

  try {
    // upd tutor info
    const tutor = await prisma.tutor.findUnique({
      where: {
        id: tutorId,
      },
    });
    if (!tutor) {
      return res
        .status(404)
        .json({ ok: false, message: 'Tutor no encontrado' });
    }
    const userTutor = await prisma.user.findUnique({
      where: {
        id: tutor.userId,
      },
    });
    if (!userTutor) {
      return res
        .status(404)
        .json({ ok: false, message: 'Usuario tutor no encontrado' });
    }

    const updateUser = prisma.user.update({
      where: {
        id: userTutor.id,
      },
      data: {
        email: req.body.email,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        nombre: req.body.nombre,
        identificacion: req.body.identificacion,
      },
    });

    const updateTutor = prisma.tutor.update({
      where: {
        id: tutorId,
      },
      data: {
        observaciones: req.body.observaciones || '',
      },
    });

    const updatePet = prisma.mascota.update({
      where: {
        id: +id,
      },
      data: {
        nombre_mascota,
        codigo_chip,
        lugar_implantacion,
        fecha_implantacion,
        fecha_nacimiento,
        especie,
        raza,
        sexo,
        ubicacion,
        esterilizado,
      },
    });

    // eslint-disable-next-line no-unused-vars
    const [_, __, pet] = await Promise.all([
      updateUser,
      updateTutor,
      updatePet,
    ]);

    res.status(200).json({ ok: true, pet });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pet = await prisma.mascota.findUnique({
      where: {
        id: +id,
      },
    });

    if (!pet) {
      return res
        .status(404)
        .json({ ok: false, message: 'Mascota no encontrada' });
    }

    await prisma.mascota.delete({
      where: {
        id: +id,
      },
    });

    res.status(200).json({ ok: true, message: 'Mascota eliminada con éxito!' });
  } catch (error) {
    next(error);
  }
};
