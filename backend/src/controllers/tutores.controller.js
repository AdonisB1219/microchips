import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';

export const getTutores = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.page_size || 10;
    const search = req.query?.nombre;
    const skip = (page - 1) * limit;

    const filterOptions = {
      user: {
        nombre: {
          contains: search,
        },
      },
    };


    if (req.authenticatedUser.rolId != 4) {
      filterOptions.user.empresaId = req.authenticatedUser.empresaId;
    }

    const tutores = await prisma.tutor.findMany({
      where: filterOptions,
      skip: skip,
      take: limit,
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

    const totalTutores = await prisma.tutor.count({
      where: {
        user: {
          nombre: {
            contains: search,
          },
        },
      },
    });
    const totalPages = Math.ceil(totalTutores / limit);

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.status(200).json({
      ok: true,
      count: totalTutores,
      next:
        page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      numero_paginas: totalPages,
      data: tutores,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTutores = async (req, res, next) => {
  try{

    let filterOptions = {
      empresaId: req.authenticatedUser.Empresa.id
}

if (req.authenticatedUser.rolId === 4) {
  filterOptions = {

  }
}
  const tutores = await prisma.tutor.findMany({
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

  res.status(200).json({
    ok: true,
    data: tutores,
  });
} catch (error) {
  next(error);
}
}

export const getTutor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tutor = await prisma.tutor.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            identificacion: true,
            telefono: true,
            email: true,
            Empresa: {
              select: {
                nombre_empresa: true,
                id: true
              }
            }
          },
        },
      },
    });

    if (!tutor) {
      return res.status(404).json({
        ok: false,
        message: 'Tutor no encontrado',
      });
    }

    if(req.authenticatedUser.Empresa.id != tutor.user.Empresa.id && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }

    res.status(200).json(tutor);
  } catch (error) {
    next(error);
  }
};


export const updateTutor = async (req, res, next) => {
  const { id } = req.params;
  const { email, telefono, nombre, identificacion, password, direccion } =
    req.body;

  try {
    const tutor = await prisma.tutor.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            Empresa: true
          }
        }
      }
    });

    if (!tutor) {
      return res.status(404).json({
        ok: false,
        message: 'Tutor no encontrado',
      });
    }

    if(req.authenticatedUser.empresaId != tutor.user.Empresa.id && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }

    const updatedPassword = await bcryptjs.hash(password || '', 10);
    const user = await prisma.user.update({
      where: {
        id: tutor.userId,
      },
      data: {
        email,
        telefono,
        nombre,
        identificacion,
        ...(password && { password: updatedPassword }),
      },
    });

    await prisma.tutor.update({
      where: {
        id
      },
      data: {
        direccion
      }
    })

    res.status(200).json({
      ok: true,
      message: 'Tutor actualizado con éxito!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTutor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tutor = await prisma.tutor.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            empresaId: true,
            email: true
          }
        }
      }
    });


    if (!tutor) {
      return res.status(404).json({
        ok: false,
        message: 'Tutor no encontrado',
      });
    }

    if(req.authenticatedUser.empresaId != tutor.user.empresaId && req.authenticatedUser.rolId != 4){
      res.status(401).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
    }

    await prisma.user.delete({
      where: {
        id: tutor.userId,
      },
    });

    
    await prisma.onDeleteLogs.create({
      data: {
          descripcion: `El usuario-tutor ${tutor.userId}  - ${tutor.user.email} fue eliminado por el usuario ${req.authenticatedUser.id} - ${req.authenticatedUser.email}`
      }
  });

    res.status(200).json({
      ok: true,
      message: 'Tutor eliminado con éxito!',
    });
  } catch (error) {
    next(error);
  }
};
