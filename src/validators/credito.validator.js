const { body, param } = require('express-validator');

exports.crearCreditoValidator = [
  body('nombre_cliente').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('monto').isFloat({ gt: 0 }).withMessage('El monto debe ser mayor a 0'),
  body('descripcion').optional().isString(),
  body('fecha_limite').optional().isISO8601().withMessage('La fecha límite es inválida'),
  body('cliente_id').optional().isInt({ min: 1 }).withMessage('Cliente inválido'),
  body('venta_id').optional().isInt({ min: 1 }).withMessage('Venta inválida')
];

exports.pagoCreditoValidator = [
  body('monto').isFloat({ gt: 0 }).withMessage('El monto del pago debe ser mayor a 0'),
  body('observaciones').optional().isString()
];

exports.validarIdCredito = [
  param('id').isInt({ min: 1 }).withMessage('ID de crédito inválido')
];