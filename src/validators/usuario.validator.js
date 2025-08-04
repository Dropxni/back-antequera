const { body, param } = require('express-validator');

const registrarUsuarioValidator = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['administrador', 'cajero']).withMessage('Rol inválido'),

  body('sucursal_id')
    .notEmpty().withMessage('La sucursal es obligatoria')
    .isInt().withMessage('Sucursal debe ser un número entero'),
];

const actualizarUsuarioValidator = [
  param('id')
    .isInt().withMessage('ID inválido'),

  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3, max: 100 }),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['administrador', 'cajero']),

  body('sucursal_id')
    .notEmpty().withMessage('Sucursal requerida')
    .isInt()
];

module.exports = {
  registrarUsuarioValidator,
  actualizarUsuarioValidator
};