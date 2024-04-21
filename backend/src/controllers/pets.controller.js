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

    let filterOptions = {
      AND: [
        {
          empresaId: req.authenticatedUser.empresaId
        },
        {
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
        }
      ]
    }

    if (req.authenticatedUser.rol === 4) {
      filterOptions = {
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
      }
    }

    const pets = await prisma.mascota.findMany({
      skip: skip,
      take: limit,
      where: filterOptions,

      include: {
        Tutor: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                identificacion: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
        Veterinario: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                identificacion: true,
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
                telefono: true,
                email: true,
              },
            },
          },
        },
        Veterinario: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                identificacion: true,
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
                telefono: true,
                email: true,
              },
            },
          },
        },
        Veterinario: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                identificacion: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if(req.authenticatedUser.empresaId != pet.empresaId && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para ver este registro' });
    }

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

      const veterinario = await prisma.veterinario.findFirst({
        where: {
          userId: req.authenticatedUser.id,
        },
      });
  
      if (!veterinario) {
        return res
          .status(400)
          .json({ ok: false, message: 'Debes estar logeado como veterinario para realizar este registro' });
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 10);

      userTutor = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          telefono: req.body.telefono,
          nombre: req.body.nombre,
          identificacion: req.body.identificacion,
          rolId: 1,
          empresaId: req.authenticatedUser.empresaId
        },
      });

      tutor = await prisma.tutor.create({
        data: {
          userId: userTutor?.id,
          observaciones: observaciones || '',
          direccion: req.body.direccion
        },
      });
    }


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
        esterilizado,
        aga,
        tutorId: tutorId || tutor.id,
        veterinarioId: veterinario.id,
        empresaId: req.authenticatedUser.empresaId
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
    aga,
    esterilizado,
    tutorId,
    veterinarioId
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

    if(req.authenticatedUser.empresaId != userTutor.empresaId && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }

    const updateUser = prisma.user.update({
      where: {
        id: userTutor.id,
      },
      data: {
        email: req.body.email,
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
        direccion: req.body.direccion,
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
        esterilizado,
        aga,
        veterinarioId
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

    if(req.authenticatedUser.empresaId != pet.empresaId && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
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
