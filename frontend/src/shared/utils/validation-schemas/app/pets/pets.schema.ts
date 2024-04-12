import * as yup from 'yup';
import { emailYupValidation } from '../../auth.validacion-schema';

export const petFormSchema = yup.object({
  nombre_mascota: yup.string().required('El campo nombre animal de compañía es requerido'),
  codigo_chip: yup.string().required('El campo codigo chip es requerido').max(16, 'El microchip no puede tener más de 16 caracteres'),
  lugar_implantacion: yup
    .string()
    .required('El campo lugar implantacion es requerido'),
  fecha_implantacion: yup
    .string()
    .required('El campo fecha implantacion es requerido'),
  fecha_nacimiento: yup
    .string()
    .required('El campo fecha nacimiento es requerido'),
  especie: yup.string().required('El campo especie es requerido'),
  raza: yup.string().required('El campo raza es requerido'),
  sexo: yup.string().required('El campo sexo es requerido'),
  ubicacion: yup.string().required('El campo informacion adicional es requerido'),
  esterilizado: yup.string().required('El campo Esterilizado/a es requerido'),
  tutorId: yup.string().required('El campo tutor es requerido'),
  aga: yup.string().required('El campo aga es requerido'),
});

export const petFormSchemaWithTutor = yup.object({
  // pet
  nombre_mascota: yup.string().required('El campo nombre animal de compañía es requerido'),
  codigo_chip: yup.string().required('El campo codigo chip es requerido').max(16, 'El microchip no puede tener más de 16 caracteres'),
  lugar_implantacion: yup
    .string()
    .required('El campo lugar implantacion es requerido'),
  fecha_implantacion: yup
    .string()
    .required('El campo fecha implantacion es requerido'),
  fecha_nacimiento: yup
    .string()
    .required('El campo fecha nacimiento es requerido'),
  especie: yup.string().required('El campo especie es requerido'),
  raza: yup.string().required('El campo raza es requerido'),
  sexo: yup.string().required('El campo sexo es requerido'),
  ubicacion: yup.string().required('El campo informacion adicional es requerido'),
  esterilizado: yup.string().required('El campo Esterilizado/a es requerido'),
  aga: yup.string().required('El campo aga es requerido'),

  // tutor
  observaciones: yup.string().required('El campo observaciones es requerido'),
  nombre: yup.string().required('El campo nombre es requerido'),
  identificacion: yup.string().required('El campo identificacion es requerido').max(13, 'La identificación no puede tener más de 13 caracteres'),
  direccion: yup.string().required('El campo direccion es requerido'),
  telefono: yup.string().required('El campo telefono es requerido'),
  email: emailYupValidation,

  isEditting: yup.boolean().optional(),
  password: yup
    .string()
    .optional()
    .when('isEditting', {
      is: false,
      then: schema => schema.required('El campo contraseña es requerido'),
    })
    .when('isEditting', {
      is: false,
      then: schema =>
        schema.min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
});
