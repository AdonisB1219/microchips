import * as yup from 'yup';

export const personaFormSchema = yup.object({
  cedula: yup.string().required('El campo cedula es requerido'),
  calleDomicilio: yup.string().optional().nullable(),
  numeroDomicilio: yup.string().optional().nullable(),
  condicionCedulado: yup
    .string()
    .required('El campo condicionCedulado es requerido'),
  conyuge: yup.string().required('El campo conyuge es requerido'),
  domicilio: yup.string().required('El campo domicilio es requerido'),
  estadoCivil: yup.string().required('El campo estadoCivil es requerido'),
  fechaNacimiento: yup
    .string()
    .required('El campo fechaNacimiento es requerido'),
  fechaCedulacion: yup
    .string()
    .required('El campo fechaCedulacion es requerido'),
  fechaInscripcionDefuncion: yup
    .string()
    .required('El campo fechaInscripcionDefuncion es requerido'),
  fechaInscripcionGenero: yup
    .string()
    .required('El campo fechaInscripcionGenero es requerido'),
  lugarInscripcionGenero: yup
    .string()
    .required('El campo lugarInscripcionGenero es requerido'),
  genero: yup.string().required('El campo genero es requerido'),
  instruccion: yup.string().required('El campo instruccion es requerido'),
  lugarNacimiento: yup
    .string()
    .required('El campo lugarNacimiento es requerido'),
  nacionalidad: yup.string().required('El campo nacionalidad es requerido'),
  nombreMadre: yup.string().required('El campo nombreMadre es requerido'),
  nombrePadre: yup.string().required('El campo nombrePadre es requerido'),
  nombre: yup.string().required('El campo nombre es requerido'),
  profesion: yup.string().required('El campo profesion es requerido'),
  sexo: yup.string().required('El campo sexo es requerido'),
  discapacidad: yup
    .boolean()
    .typeError('El campo discapacidad es requerido')
    .required('El campo discapacidad es requerido'),
  edad: yup
    .number()
    .typeError('El campo edad es requerido')
    .required('El campo edad es requerido'),
  terceraEdad: yup
    .boolean()
    .typeError('El campo terceraEdad es requerido')
    .required('El campo terceraEdad es requerido'),
});
