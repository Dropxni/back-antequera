const express = require('express');
const router = express.Router();
const { login, registrarUsuario } = require('../controllers/auth.controller');
const { verificarAutenticacion, soloAdministrador } = require('../middlewares/auth.middleware');

router.post('/login', login);

// Ruta protegida solo admin
router.post('/register', verificarAutenticacion, soloAdministrador, registrarUsuario);

module.exports = router;