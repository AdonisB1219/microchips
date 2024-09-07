import { Empresa, User } from '../..';
import { Veterinario } from '../veterinarios/veterinario.interface';

export interface PetsPaginatedRes {
  ok: boolean;
  count: number;
  next: null;
  previous: null;
  numero_paginas: number;
  data: PetPopulated[];
}

export interface Pet {
  id?: number;

  nombre_mascota: string;
  codigo_chip: string;
  lugar_implantacion: string;
  fecha_implantacion: string;
  fecha_nacimiento: string;
  especie: string;
  raza: string;
  sexo: string;
  ubicacion: string;
  aga: string;
  esterilizado: string;
  tutorId: number;
  responsableId: number;
  empresa?: Empresa
}

export interface PetForm {
  nombre_mascota: string;
  codigo_chip: string;
  lugar_implantacion: string;
  fecha_implantacion: string;
  fecha_nacimiento: string;
  especie: string;
  raza: string;
  sexo: string;
  ubicacion: string;
  aga: string;
  esterilizado: string;

  // tutor
  email: string;
  password: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  direccion: string;
}

// ---------
export interface PetPopulated {
  id: number;
  nombre_mascota: string;
  codigo_chip: string;
  lugar_implantacion: string;
  fecha_implantacion: string;
  fecha_nacimiento: string;
  especie: string;
  raza: string;
  sexo: string;
  ubicacion: string;
  aga: string;
  esterilizado: string;
  tutorId: number;
  responsableId: number;
  Tutor: Tutor;
  Veterinario: Veterinario;
}

export interface Tutor {
  id: number;
  observaciones: string;
  nombre_tutor?: string;
  direccion: string;
  userId: number;
  user: User;
}
