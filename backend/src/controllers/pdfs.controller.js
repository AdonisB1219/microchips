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

    const pdf = buildPdfPetD(pet);

    res.set('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};
