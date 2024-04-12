import * as yup from 'yup';

export const consultasSchema = yup.object({
  tipo_identificacion: yup
    .string()
    .required('El tipo de identificación es requerido'),
  numero_identificacion: yup
    .string()
    .required('El número de identificación es requerido'),
});
