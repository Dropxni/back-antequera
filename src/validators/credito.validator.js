const { body, param } = require('express-validator');

const crearCreditoValidator = [
  body('venta_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('venta_id debe ser un número entero positivo'),
  
  body('cliente_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('cliente_id debe ser un número entero positivo'),
  
  body('monto_total')
    .notEmpty()
    .withMessage('monto_total es requerido')
    .isFloat({ min: 0.01 })
    .withMessage('monto_total debe ser un número mayor a 0'),
  
  body('fecha_limite_pago')
    .notEmpty()
    .withMessage('fecha_limite_pago es requerida')
    .isISO8601()
    .withMessage('fecha_limite_pago debe tener formato de fecha válido'),
  
  body('cliente_nombre')
    .notEmpty()
    .withMessage('cliente_nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('cliente_nombre debe tener entre 2 y 100 caracteres'),
  
  body('cliente_telefono')
    .optional()
    .isLength({ min: 8, max: 15 })
    .withMessage('cliente_telefono debe tener entre 8 y 15 caracteres')
];

const obtenerCreditoPorIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

module.exports = {
  crearCreditoValidator,
  obtenerCreditoPorIdValidator
};