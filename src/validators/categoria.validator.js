const { body, param } = require('express-validator');

const crearCategoriaValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres')
];

const actualizarCategoriaValidator = [
  param('id')
    .isInt().withMessage('ID inválido'),
  ...crearCategoriaValidator
];

module.exports = {
  crearCategoriaValidator,
  actualizarCategoriaValidator
};
