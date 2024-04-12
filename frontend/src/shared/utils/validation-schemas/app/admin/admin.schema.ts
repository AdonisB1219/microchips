import * as yup from 'yup';

import { emailYupValidation } from '../../auth.validacion-schema';

export const adminFormSchema = yup.object({
  nombre: yup.string().required('El campo nombre es requerido'),
  identificacion: yup.string().required('El campo identificacion es requerido'),
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
