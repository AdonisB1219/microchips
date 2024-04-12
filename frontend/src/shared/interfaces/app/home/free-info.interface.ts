import { Tutor } from '..';
import { User } from '../..';

export interface FreeInfoPaginatedRes {
  ok: boolean;
  count: number;
  next: null;
  previous: null;
  numero_paginas: number;
  data: FreeMascotaInfo[];
}

export interface FreeMascotaInfo {
  id: number;
  nombre_mascota: string;
  codigo_chip: string;
  lugar_implantacion: string;
  fecha_implantacion: string;
  especie: string;
  raza: string;
  sexo: string;
  ubicacion: string;
  aga: string;
  esterilizado: string;
  tutorId: number;
  responsableId: number;
  Responsable: Responsable;
  Tutor: Tutor;
}

export interface Responsable {
  id: number;
  no_registro: string;
  especialidad: string;
  userId: number;
  user: User;
}
