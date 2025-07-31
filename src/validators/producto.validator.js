const { body, param } = require('express-validator');

const crearProductoValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),

  body('categoria_id')
    .optional()
    .isInt().withMessage('El ID de categoría debe ser numérico'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número positivo'),

  body('codigo_barras')
    .optional()
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('fecha_caducidad')
    .optional()
    .isISO8601().withMessage('Fecha de caducidad inválida'),

  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser true o false'),
];

const actualizarProductoValidator = [
  param('id')
    .isInt().withMessage('El ID debe ser un número válido'),

  ...crearProductoValidator
];

module.exports = {
  crearProductoValidator,
  actualizarProductoValidator
};
