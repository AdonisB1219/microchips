import { body, validationResult } from 'express-validator';
import { isAlreadyRegistered } from '../helpers/index.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ ok: false, errors: errors.mapped() });

  return next();
};

// Auth
export const emailPassRules = () => [
  body('email', 'Invalid email!').isEmail(),
  body('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
];

export const signUpRules = () => [
  ...emailPassRules(),
  validate,

  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('identificacion', 'La identificación es obligatoria').notEmpty(),
  body('telefono', 'El teléfono es obligatorio').notEmpty(),
  validate,

  body('email').custom(email => isAlreadyRegistered(email, 'user')),
  validate,
];

export const createUserSimpleRules = () => [
  ...emailPassRules(),
  validate,

  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('identificacion', 'La identificación es obligatoria').notEmpty(),
  body('telefono', 'El teléfono es obligatorio').notEmpty(),
  validate,
];

export const createVeterinarianRules = () => [
  ...createUserSimpleRules(),
  body('no_registro', 'El número de registro es obligatorio').notEmpty(),
  validate,
];

export const createVeterinarianAdminRules = () => [
  ...createUserSimpleRules(),
];

export const createPetRules = () => [
  body('nombre_mascota', 'El nombre es obligatorio').notEmpty(),
  body('codigo_chip', 'El código de chip es obligatorio').notEmpty(),
  body(
    'lugar_implantacion',
    'El lugar de implantación es obligatorio'
  ).notEmpty(),
  body(
    'fecha_implantacion',
    'La fecha de implantación es obligatoria'
  ).notEmpty(),
  body('especie', 'La especie es obligatoria').notEmpty(),
  body('raza', 'La raza es obligatoria').notEmpty(),
  body('sexo', 'El sexo es obligatorio').notEmpty(),
  body('esterilizado', 'El campo esterilizado es obligatorio').notEmpty(),
  // body('tutorId', 'El tutor es obligatorio').notEmpty(),
  validate,

  // signUpRules(),
];

export const loginRules = () => [...emailPassRules(), validate];
