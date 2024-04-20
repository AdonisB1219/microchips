import bcryptjs from 'bcryptjs';

import { prisma } from '../db/mysql/index.js';


export const createSuperAdminUser = async () => {
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
          rolId: 4
        },
      });

      await prisma.superAdministrador.create({
        data: {
          userId: user?.id,
        },
      });
    } catch (error) {
      console.log('Error creating admin user:', error);
      process.exit(1);
    }
  }
}; 
