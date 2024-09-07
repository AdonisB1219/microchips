import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';


export const createSuperAdminUser = async () => {

  let mauliscorp = await prisma.empresa.findFirst({
    where: {
      nombre_empresa: "MAULISCORP"
    }
  })

  if(!mauliscorp){
    mauliscorp = await prisma.empresa.create({
      data: {
        nombre_empresa: "MAULISCORP",
        direccion: "direccion",
        email: "mauliscorp@mauliscorp.com",
        telefono: "5510"
      }
    })
  }

  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: 'superadmin@admin.com',
    },
  });

  if (!existingAdmin) {
    try {
      const hashedPassword = await bcryptjs.hash('adminadmin', 10);

      const user = await prisma.user.create({
        data: {
          email: 'superadmin@admin.com',
          password: hashedPassword,
          nombre: 'SUPER-ADMIN',
          identificacion: '1717172732',
          telefono: '0999999999',
          rolId: 4,
          empresaId: mauliscorp.id
        },
      });

      const existingVet = await prisma.veterinario.findFirst({
        where: {
          userId: user.id,
        },
      });

      if(!existingVet){
        try {
          await prisma.veterinario.create({
            data: {
              no_registro: '1111111',
              userId: user.id
            }
          });
        } catch(e) {
          console.log(e)
        }
      }

    } catch (error) {
      console.log('Error creating admin user:', error);
      process.exit(1);
    }
  }
}; 
