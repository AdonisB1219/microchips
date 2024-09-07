import { Empresa, User } from '../..';

export interface VeterinarisoPaginatedRes {
  ok: boolean;
  count: number;
  next: null;
  previous: null;
  numero_paginas: number;
  data: Veterinario[];
}

export interface Veterinario {
  id: number;
  no_registro: string;

  user?: User;

  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  email: string;
  password: string;
  empresa?: Empresa
}
