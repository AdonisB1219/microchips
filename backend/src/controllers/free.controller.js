/* import { prisma } from '../db/mysql/index.js';

export const getPetsFree = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const searchTerm = req.query?.search;

    const pets = await prisma.mascota.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: searchTerm,
            },
          },
          {
            codigo_chip: {
              contains: searchTerm,
            },
          },
          {
            Responsable: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
        ],
      },
      include: {
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
      },
    });

    const totalPets = await prisma.mascota.count({
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: searchTerm,
            },
          },
          {
            codigo_chip: {
              contains: searchTerm,
            },
          },
          {
            Responsable: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalPets / limit);

    res.status(200).json({
      ok: true,
      count: totalPets,
      next: page < totalPages ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      numero_paginas: totalPages,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const searchPets = async (req, res, next) => {
  try {
    const searchTerm = req.query.search;
    const page = +req.query.page || 1;
    const pageSize = +req.query.page_size || 10;

    const pets = await prisma.mascota.findMany({
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: searchTerm,
            },
          },
          {
            codigo_chip: {
              contains: searchTerm,
            },
          },
          {
            Responsable: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Responsable: {
          include: {
            user: true,
          },
        },
        Tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    const totalPets = await prisma.mascota.count({
      where: {
        OR: [
          {
            nombre_mascota: {
              contains: searchTerm,
            },
          },
          {
            codigo_chip: {
              contains: searchTerm,
            },
          },
          {
            Responsable: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
          {
            Tutor: {
              user: {
                nombre: {
                  contains: searchTerm,
                },
              },
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(totalPets / pageSize);

    res.status(200).json({
      ok: true,
      count: totalPets,
      next: page < totalPages ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      numero_paginas: totalPages,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};
 */