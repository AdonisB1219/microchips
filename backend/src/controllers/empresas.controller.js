import { prisma } from '../db/mysql/index.js';

export const getEmpresas = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.page_size || 10;
        const skip = (page - 1) * limit;
        const search = req.query?.nombre_empresa;

        const empresas = await prisma.empresa.findMany({
            skip: skip,
            take: limit,
            where: {
                nombre_empresa: {
                    contains: search,
                },

            },
        });

        const totalEmpresas = await prisma.empresa.count({
            where: {
                nombre_empresa: {
                    contains: search,
                },
            },
        });
        const totalPages = Math.ceil(totalEmpresas / limit);

        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        res.status(200).json({
            ok: true,
            count: totalEmpresas,
            next:
                page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
            previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
            numero_paginas: totalPages,
            data: empresas,
        });

    } catch (error) {
        next(error);
    }

}


export const createEmpresa = async (req, res, next) => {
    const { nombre_empresa, direccion, telefono, email } =
        req.body;

    try {

        // validate if email already exists
        const empresaExists = await prisma.empresa.findFirst({
            where: {
                nombre_empresa,
            },
        });
        if (empresaExists)
            return res
                .status(400)
                .json({ ok: false, message: 'Esa empresa ya fue registrada' });

        // create user
        const empresa = await prisma.empresa.create({
            data: {
                nombre_empresa,
                direccion,
                telefono,
                email
            },
        });

        res
            .status(201)
            .json({ ok: true, message: 'Empresa creada con éxito!', empresa });
    } catch (error) {
        next(error);
    }
};

export const deleteEmpresa = async (req, res, next) => {
    const { id } = req.params;
    try {
        const empresa = await prisma.empresa.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!empresa) {
            return res.status(404).json({
                ok: false,
                message: 'Empresa no encontrada',
            });
        }

        await prisma.empresa.delete({
            where: {
                id: parseInt(id)
            },
        });

        await prisma.onDeleteLogs.create({
            data: {
                descripcion: `La empresa ${empresa.nombre_empresa} fue eliminada por el usuario ${req.authenticatedUser.id} - ${req.authenticatedUser.email}`
            }
        });

        res.status(200).json({
            ok: true,
            message: 'Empresa eliminada con éxito!',
        });
    } catch (error) {
        next(error);
    }
};

export const getEmpresa = async (req, res, next) => {
    const { id } = req.params;
    try {

        const empresa = await prisma.empresa.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!empresa) {
            return res.status(404).json({
                ok: false,
                message: 'Empresa no encontrado',
            });
        }

        res.status(200).json(empresa);

    } catch (error) {
        next(error);
    }

}

export const updateEmpresa = async (req, res, next) => {
    const { id } = req.params;
    const { direccion, telefono, email, nombre_empresa } =
        req.body;

    try {
        const empresa = await prisma.empresa.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!empresa) {
            return res.status(404).json({
                ok: false,
                message: 'Empresa no encontrado',
            });
        }

        const user = await prisma.empresa.update({
            where: {
                id: empresa.id
            },
            data: {
                email,
                direccion,
                telefono,
                nombre_empresa
            },
        });

        res.status(200).json({
            ok: true,
            message: 'Empresa actualizado con éxito!',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
