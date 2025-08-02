const { body } = require('express-validator');

const abrirCorteValidator = [
  body('cambio_inicial')
    .notEmpty().withMessage('Debe ingresar el cambio inicial')
    .isFloat({ min: 0 }).withMessage('Debe ser un número válido')
];

module.exports = {
  abrirCorteValidator
};