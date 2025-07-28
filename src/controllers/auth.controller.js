const { Usuario } = require('../../models');
const bcrypt = require('bcryptjs');
const { generarToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { username, activo: true } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generarToken({
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      sucursal_id: usuario.sucursal_id
    });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
        sucursal_id: usuario.sucursal_id
      }
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

const registrarUsuario = async (req, res) => {
  try {
    const { username, password, rol, sucursal_id } = req.body;

    if (!username || !password || !rol || !sucursal_id) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const existente = await Usuario.findOne({ where: { username } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      username,
      password: hash,
      rol,
      sucursal_id,
      activo: true
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        rol: nuevoUsuario.rol,
        sucursal_id: nuevoUsuario.sucursal_id
      }
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
  }
};

module.exports = {
  login,
  registrarUsuario
};
