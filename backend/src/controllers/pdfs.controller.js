import 'jspdf-autotable';

import { prisma } from '../db/mysql/index.js';
import { buildPdfPetD } from '../utils/jspdf.js';

export const pdfPet = async (req, res, next) => {
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
      res.status(401).json({ ok: false, msg: 'No tienes permisos para ver este pdf' });
    }

    if(req.authenticatedUser.rolId === 1 && pet.Tutor.user.id != req.authenticatedUser.id) {
      res.status(401).json({ ok: false, msg: 'No tienes permisos para ver este pdf' });
    }


    const pdf = buildPdfPetD(pet);

    res.set('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};
