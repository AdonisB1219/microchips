import * as yup from 'yup';

import { emailYupValidation } from '../../auth.validacion-schema';

export const tutorFormSchema = yup.object({
  observaciones: yup.string().required('El campo observaciones es requerido'),
  nombre: yup.string().required('El campo nombre es requerido'),
  identificacion: yup.string().required('El campo identificacion es requerido').max(13, 'La identificación no puede tener más de 13 caracteres'),
  direccion: yup.string().required(),
  telefono: yup.string().required('El campo telefono es requerido'),
  email: emailYupValidation,
  isEditting: yup.boolean().optional(),
  empresa: yup.string().optional(),
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
