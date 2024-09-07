import { Empresa } from "../app";

export interface LoginResponse {
  ok: boolean;
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: number;
  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  email: string;
  rolId: number;
  Empresa: Empresa

}
