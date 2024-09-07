export interface EmpresaPaginatedRes {
    ok: boolean;
    count: number;
    next: null;
    previous: null;
    numero_paginas: number;
    data: Empresa[];
}

export interface Empresa {
    id: number;

    nombre_empresa: string;
    direccion: string;
    telefono: string;
    email: string;
}
