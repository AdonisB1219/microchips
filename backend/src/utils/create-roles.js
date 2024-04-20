import { prisma } from '../db/mysql/index.js';

const roles = ['tutor', 'veterinario', 'administrador', 'superadministrador'];

export const createRoles = async () => {
    for (let role of roles) {
        let existingRole = await prisma.roles.findFirst({
            where: {
                rol: role,
            },
        });

        if (!existingRole) {
            await prisma.roles.create({
                data: {
                    rol: role
                },
            });
        }
    }
}


