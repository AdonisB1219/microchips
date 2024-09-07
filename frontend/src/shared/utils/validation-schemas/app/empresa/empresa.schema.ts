import * as yup from 'yup';

import { emailYupValidation } from '../../auth.validacion-schema';

export const empresaFormSchema = yup.object({
    nombre_empresa: yup.string().required('El campo nombre es requerido'),
    direccion: yup.string().required('El campo direccion es requerido'),
    telefono: yup.string().required('El campo telefono es requerido'),
    email: emailYupValidation,

});
