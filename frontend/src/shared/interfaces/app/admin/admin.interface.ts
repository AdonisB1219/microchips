export interface AdminPaginatedRes {
  ok: boolean;
  count: number;
  next: null;
  previous: null;
  numero_paginas: number;
  data: Admin[];
}

export interface Admin {
  id: number;

  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  email: string;
  password: string;
}
