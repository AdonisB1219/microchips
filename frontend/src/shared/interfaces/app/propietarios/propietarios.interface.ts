import { Empresa, User } from '../..';

export interface PropietarioPaginatedRes {
  ok: boolean;
  count: number;
  next: null;
  previous: null;
  numero_paginas: number;
  data: Propietario[];
}

export interface Propietario {
  id: number;
  observaciones: string;
  nombre_tutor?: string;
  userId: number;
  user: User;
}
