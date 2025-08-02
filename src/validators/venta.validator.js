const { body, param, query } = require('express-validator');

const realizarVentaValidator = [
  body('productos')
    .isArray({ min: 1 }).withMessage('Debes agregar al menos un producto'),

  body('productos.*.id')
    .isInt().withMessage('ID de producto inválido'),

  body('productos.*.cantidad')
    .isInt({ min: 1 }).withMessage('Cantidad inválida'),

  body('productos.*.precio_unitario')
    .isFloat({ min: 0 }).withMessage('Precio unitario inválido'),

  body('productos.*.subtotal')
    .isFloat({ min: 0 }).withMessage('Subtotal inválido'),

  body('total')
    .isFloat({ min: 0 }).withMessage('Total inválido'),

  body('metodo_pago')
    .notEmpty().withMessage('El método de pago es obligatorio')
    .isIn(['efectivo', 'tarjeta', 'transferencia', 'credito']).withMessage('Método de pago inválido'),

  body('monto_recibido')
    .if(body('metodo_pago').not().equals('credito'))
    .isFloat({ min: 0 }).withMessage('Monto recibido inválido'),

  body('cambio')
    .if(body('metodo_pago').not().equals('credito'))
    .isFloat({ min: 0 }).withMessage('Cambio inválido'),

  body('cliente_id')
    .if(body('metodo_pago').equals('credito'))
    .isInt().withMessage('ID de cliente inválido'),

  body('nombre_cliente')
    .if(body('metodo_pago').equals('credito'))
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),

  body('fecha_limite')
    .if(body('metodo_pago').equals('credito'))
    .isISO8601().withMessage('Fecha límite inválida')
];

const obtenerVentaPorIdValidator = [
  param('id')
    .isInt().withMessage('ID de venta inválido')
];

const rangoFechasValidator = [
  query('fecha_inicio')
    .notEmpty().withMessage('Debe proporcionar la fecha de inicio')
    .isISO8601().withMessage('Formato de fecha inválido'),

  query('fecha_fin')
    .notEmpty().withMessage('Debe proporcionar la fecha de fin')
    .isISO8601().withMessage('Formato de fecha inválido'),

  query('metodo_pago')
    .optional()
    .isIn(['efectivo', 'tarjeta', 'transferencia', 'credito']).withMessage('Método de pago inválido'),

  query('cajero_id')
    .optional()
    .isInt().withMessage('El ID del cajero debe ser un número')
];

module.exports = {
  realizarVentaValidator,
  obtenerVentaPorIdValidator,
  rangoFechasValidator
};
