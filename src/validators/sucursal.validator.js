const { body } = require('express-validator');

const validarCrearSucursal = [
  body('codigo').notEmpty().withMessage('El código es obligatorio'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('direccion').optional().isString(),
  body('telefono').optional().isString(),
];

const validarActualizarSucursal = [
  body('codigo').optional(),
  body('nombre').optional(),
  body('direccion').optional().isString(),
  body('telefono').optional().isString(),
  body('activa').optional().isBoolean(),
];

module.exports = {
  validarCrearSucursal,
  validarActualizarSucursal
};